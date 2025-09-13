/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useRouter } from '@client/contexts/RouterContext';
import { useUserContext } from '@client/contexts/UserContext';
import { GameEngine } from './engine/GameEngine';
import { GameDataManager } from './data/GameDataManager';
import { getRandomGame } from './data/sampleGames';
import { getThemeData } from './data/gameData';
import { GameDataConverter } from '@client/utils/GameDataConverter';
import { getBackgroundStyle } from './assets/GameAssets';
import { GameCard, FeedbackMessage } from './components';
import { GameObject, GameState, GameFeedback } from '@shared/types/game';
import NavigationBar from '@client/components/basic/Navigation';
import { dataSync } from '@client/services/DataSyncService';
import { FullScreenLoader } from '@client/components';

export default function GamePage() {
  const router = useRouter();
  const { username } = useUserContext();
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<GameFeedback | null>(null);
  const [gameObject, setGameObject] = useState<GameObject | null>(null);
  const [challengeId, setChallengeId] = useState<string | null>(null);

  // Initialize game
  useEffect(() => {
    const initializeGame = async () => {
      try {
        const dataManager = GameDataManager.getInstance();

        // Check if this is a challenge game
        const params = router.getParams();
        const challengeIdParam = params.challengeId;

        console.log('GamePage: Router params:', params);
        console.log('GamePage: Challenge ID:', challengeIdParam);

        let game: GameObject;
        if (challengeIdParam) {
          // Load challenge-specific game from static data
          const today =
            new Date().toISOString().split('T')[0] || new Date().toISOString().substring(0, 10);
          const themeData = getThemeData(today, challengeIdParam);

          if (themeData) {
            console.log('GamePage: Found theme:', themeData.themeName);
            // Convert ThemeData to GameObject
            game = GameDataConverter.themeToGameObject(themeData);
            setChallengeId(challengeIdParam);
          } else {
            console.log('GamePage: Theme not found, using random game');
            game = getRandomGame();
          }
        } else {
          console.log('GamePage: No challenge ID, using random game');
          // Load random game
          game = getRandomGame();
        }

        // Load user data from server
        const currentUsername = username || 'anonymous'; // Use actual username or fallback
        const { gems } = await dataSync.loadInitialData(currentUsername);

        // Create initial game state with server data
        const initialState: GameState = {
          currentWordIndex: 0,
          userAnswers: [],
          score: 0,
          hintsUsed: 0,
          gems: gems,
          freeHintsUsed: 0,
          isCompleted: false,
        };

        dataManager.setCurrentGame(game);
        dataManager.setGameState(initialState);
        setGameObject(game);
        setGameState(initialState);

        const engine = new GameEngine(
          game,
          initialState,
          (newState) => {
            setGameState(newState);
            dataManager.setGameState(newState);
          },
          (newFeedback) => {
            setFeedback(newFeedback);
          },
          {
            pointsPerCorrect: 10,
            pointsPerHint: -2,
            maxFreeHints: 3,
            gemsPerHint: 1,
            timeBonus: false,
            streakMultiplier: true,
          }
        );

        setGameEngine(engine);
      } catch (error) {
        console.error('Failed to initialize game:', error);
        // Fallback to local data
        const dataManager = GameDataManager.getInstance();
        const game = getRandomGame();
        const initialState = dataManager.createInitialGameState();

        dataManager.setCurrentGame(game);
        dataManager.setGameState(initialState);
        setGameObject(game);
        setGameState(initialState);

        const engine = new GameEngine(
          game,
          initialState,
          (newState) => {
            setGameState(newState);
            dataManager.setGameState(newState);
          },
          (newFeedback) => {
            setFeedback(newFeedback);
          },
          {
            pointsPerCorrect: 10,
            pointsPerHint: -2,
            maxFreeHints: 3,
            gemsPerHint: 1,
            timeBonus: false,
            streakMultiplier: true,
          }
        );

        setGameEngine(engine);
      }
    };

    void initializeGame();
  }, [router, username]);

  // Handle game state changes
  useEffect(() => {
    if (gameState?.isCompleted && gameEngine && gameObject) {
      setUserInput('');

      const submitGameResult = async () => {
        try {
          const currentUsername = username || 'anonymous'; // Use actual username or fallback
          console.log('GamePage: Submitting game result for username:', currentUsername);
          const gameStats = gameEngine.getGameStats();

          // Submit game result to server
          const result = await dataSync.submitGameResult({
            username: currentUsername,
            challengeId: challengeId || 'random',
            score: gameState.score,
            hintsUsed: gameState.hintsUsed,
            freeHintsUsed: gameState.freeHintsUsed,
            gemsSpent: gameState.hintsUsed > 3 ? Math.floor((gameState.hintsUsed - 3) / 3) : 0,
            timeSpent: Math.floor(gameStats.timeElapsed / 1000),
            difficulty: gameObject.difficulty,
            themeName: gameObject.themeName,
            gemsEarn: gameObject.gemsEarn,
          });

          // Update local gems
          const newGems = dataSync.getCurrentGems();
          setGameState((prev) => (prev ? { ...prev, gems: newGems } : null));

          // Show completion feedback
          setFeedback({
            type: 'correct',
            message: `Game completed! You earned ${gameState.score} points and ${result.gemsEarned} gems!`,
            points: gameState.score,
          });

          // Challenge completion is handled by server
          // No local completion needed since we use static data
        } catch (error) {
          console.error('Failed to submit game result:', error);
          // Show fallback feedback
          setFeedback({
            type: 'correct',
            message: `Game completed! You earned ${gameState.score} points!`,
            points: gameState.score,
          });
        }
      };

      void submitGameResult();
    }
  }, [gameState?.isCompleted, challengeId, gameState, gameEngine, gameObject, username]);

  // Handle game completion - redirect to result page
  useEffect(() => {
    if (gameState?.isCompleted && challengeId && username) {
      const submitAndRedirect = async () => {
        try {
          console.log('GamePage: Game completed, submitting result...');

          // Get game stats for accurate time calculation
          const gameStats = gameEngine?.getGameStats();

          // Submit the game result
          await dataSync.submitGameResult({
            username,
            challengeId,
            score: gameState.score,
            hintsUsed: gameState.hintsUsed || 0,
            freeHintsUsed: 0,
            gemsSpent: 0,
            timeSpent: gameStats ? Math.floor(gameStats.timeElapsed / 1000) : 0, // Calculate actual time spent
            difficulty: gameObject?.difficulty || 'easy',
            themeName: gameObject?.themeName || 'Unknown',
            gemsEarn: gameObject?.gemsEarn || 0,
          });

          console.log('GamePage: Game result submitted, redirecting to result page...');

          // Redirect directly to result page
          router.goto('game-result', {
            challengeId,
            username,
          });
        } catch (error) {
          console.error('GamePage: Error submitting game result:', error);
          // Fallback to challenges page
          router.goto('daily-challenges');
        }
      };

      void submitAndRedirect();
    }
  }, [
    gameState?.isCompleted,
    challengeId,
    username,
    gameState?.score,
    gameState?.hintsUsed,
    gameObject?.themeName,
    router,
  ]);

  if (!gameEngine || !gameState || !gameObject) {
    return <FullScreenLoader isLoading={true} variant="game" message="Loading game" />;
  }

  // Show loading while submitting and redirecting
  if (gameState?.isCompleted) {
    return (
      <FullScreenLoader
        isLoading={true}
        variant="game"
        message="Game Completed! Submitting results"
      />
    );
  }

  const currentWord = gameEngine.getCurrentWord();
  if (!currentWord) {
    return <FullScreenLoader isLoading={true} variant="game" message="No more words to find!" />;
  }

  const handleSubmit = () => {
    const isCorrect = gameEngine.submitAnswer(userInput);
    if (isCorrect) {
      setUserInput('');
    }
  };

  const handleHint = () => {
    return gameEngine.useHint();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleBackToHome = () => {
    const dataManager = GameDataManager.getInstance();
    dataManager.resetGameData();
    router.goto('daily-challenges');
  };

  return (
    <div
      className="w-full min-h-screen relative bg-cover bg-center bg-no-repeat"
      style={getBackgroundStyle(gameObject.themeName)}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/90"></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col p-6">
        <NavigationBar title={gameObject.themeName} onBack={handleBackToHome} />
        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-white mb-6">
            Find The <span className="text-yellow-400 font-[800]">Homophone</span>
          </h2>

          <div className="max-w-2xl w-full mx-auto text-center">
            <GameCard
              gameState={gameState}
              content={gameObject.content}
              correctWords={gameObject.correctWords}
              userInput={userInput}
              onInputChange={setUserInput}
              onSubmit={handleSubmit}
              onKeyDown={handleKeyDown}
              onHint={handleHint}
              canUseHint={gameEngine.canUseHint()}
              feedback={feedback}
              streakInfo={gameEngine.getStreakInfo()}
            />

            {feedback && <FeedbackMessage feedback={feedback} />}
          </div>
        </div>
      </div>
    </div>
  );
}
