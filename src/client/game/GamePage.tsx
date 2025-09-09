import React, { useState, useEffect } from 'react';
import { useRouter } from '@client/contexts/RouterContext';
import { GameEngine } from './engine/GameEngine';
import { GameDataManager } from './data/GameDataManager';
import { getRandomGame } from './data/sampleGames';
import { getBackgroundStyle } from './assets/GameAssets';
import { GameCard, FeedbackMessage, GameComplete } from './components';
import { GameObject, GameState, GameFeedback } from '@shared/types/game';
import NavigationBar from '@client/components/basic/Navigation';

export default function GamePage() {
  const router = useRouter();
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<GameFeedback | null>(null);
  const [gameObject, setGameObject] = useState<GameObject | null>(null);

  // Initialize game
  useEffect(() => {
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
        maxHints: 3,
        timeBonus: true,
        streakMultiplier: true,
      }
    );

    setGameEngine(engine);
  }, []);

  // Handle game state changes
  useEffect(() => {
    if (gameState?.isCompleted) {
      setUserInput('');
    }
  }, [gameState?.isCompleted]);

  if (!gameEngine || !gameState || !gameObject) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading game...</div>
      </div>
    );
  }

  // Show game complete screen
  if (gameState.isCompleted) {
    return <GameComplete finalScore={gameState.score} onBackToHome={() => router.goto('home')} />;
  }

  const currentWord = gameEngine.getCurrentWord();
  if (!currentWord) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">No more words to find!</div>
      </div>
    );
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleBackToHome = () => {
    const dataManager = GameDataManager.getInstance();
    dataManager.resetGameData();
    router.goto('home');
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
        {/* <GameHeader themeName={gameObject.themeName} onBack={handleBackToHome} />
         */}
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
              onKeyPress={handleKeyPress}
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
