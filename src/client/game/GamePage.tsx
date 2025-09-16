import React, { useState, useEffect } from 'react';
import { useRouter } from '@client/contexts/RouterContext';
import { useUserContext } from '@client/contexts/UserContext';
import { GameEngine } from './engine/GameEngine';
import { getThemeData } from './data/gameData';
import { GameDataConverter } from '@client/utils/GameDataConverter';
import { GameCard, FeedbackMessage } from './components';
import { GameObject, GameState, GameFeedback } from '@shared/types/game';
import NavigationBar from '@client/components/basic/Navigation';
import { dataSync } from '@client/services/DataSyncService';
import { FullScreenLoader } from '@client/components';
import { TimeService } from '@client/services/TimeService';

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
        // Check if this is a challenge game
        const params = router.getParams();
        const challengeIdParam = params.challengeId;

        console.log('GamePage: Router params:', params);
        console.log('GamePage: Challenge ID:', challengeIdParam);

        let game: GameObject;
        if (challengeIdParam) {
          // Load challenge-specific game from static data
          const today = await TimeService.getToday();
          const themeData = getThemeData(today, challengeIdParam);

          if (themeData) {
            console.log('GamePage: Found theme:', themeData.themeName);
            // Convert ThemeData to GameObject
            game = GameDataConverter.themeToGameObject(themeData);
            setChallengeId(challengeIdParam);
          } else {
            throw new Error('Theme not found for challenge ID: ' + challengeIdParam);
          }
        } else {
          throw new Error('No challenge ID provided');
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

        setGameObject(game);
        setGameState(initialState);

        const engine = new GameEngine(
          game,
          initialState,
          (newState) => {
            setGameState(newState);
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
        // Redirect back to challenges page on error
        router.goto('daily-challenges');
      }
    };

    void initializeGame();
  }, [router, username]);

  // Handle game completion - submit result and redirect
  useEffect(() => {
    if (gameState?.isCompleted && gameEngine && gameObject && challengeId && username) {
      setUserInput('');

      const submitAndRedirect = async () => {
        try {
          console.log('GamePage: Game completed, submitting result...');

          // Get game stats for accurate time calculation
          const gameStats = gameEngine.getGameStats();

          // Submit the game result
          const result = await dataSync.submitGameResult({
            username,
            challengeId,
            score: gameState.score,
            hintsUsed: gameState.hintsUsed || 0,
            freeHintsUsed: gameState.freeHintsUsed || 0,
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

          console.log('GamePage: Game result submitted, redirecting to result page...');

          // Redirect directly to result page
          router.goto('game-result', {
            challengeId,
            username,
          });
        } catch (error) {
          console.error('GamePage: Error submitting game result:', error);
          // Show fallback feedback
          setFeedback({
            type: 'correct',
            message: `Game completed! You earned ${gameState.score} points!`,
            points: gameState.score,
          });
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
    gameState?.freeHintsUsed,
    gameObject?.themeName,
    gameObject?.difficulty,
    gameObject?.gemsEarn,
    gameEngine,
    gameObject,
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
    gameEngine.submitAnswer(userInput);
    setUserInput('');
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
    router.goto('daily-challenges');
  };

  return (
    <div
      className="w-full min-h-screen relative bg-cover bg-center bg-no-repeat bg-transparent bg-fixed"
      style={{ backgroundImage: `url(${gameObject.themeBgImage})` }}
    >
      {/* Dark Overlay */}
      <div className="w-full bg-black/70">
        <NavigationBar title={gameObject.themeName} onBack={handleBackToHome} />
        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col p-6 pt-0 ">
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* <h2 className="text-2xl font-bold text-white mb-6">
            Find The <span className="text-yellow-400 font-[800]">Homophone</span>
          </h2> */}

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
    </div>
  );
}
