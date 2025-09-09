// Example usage of the enhanced GameEngine
import { GameEngine } from '../engine/GameEngine';
import { GameObject, GameState } from '@shared/types/game';

// Example game object
const exampleGame: GameObject = {
  themeName: 'Example Theme',
  content: 'This is an example sentence with some incorrect words.',
  correctWords: ['example', 'sentence', 'incorrect'],
  themeBgImage: 'placeholder',
};

// Example initial state
const initialState: GameState = {
  currentWordIndex: 0,
  userAnswers: [],
  score: 0,
  hintsUsed: 0,
  isCompleted: false,
};

// Example configuration
const gameConfig = {
  pointsPerCorrect: 15,
  pointsPerHint: -3,
  maxHints: 2,
  timeBonus: true,
  streakMultiplier: true,
};

// Create game engine instance
const gameEngine = new GameEngine(
  exampleGame,
  initialState,
  (newState) => {
    console.log('Game state updated:', newState);
  },
  (feedback) => {
    console.log('Feedback:', feedback);
  },
  gameConfig
);

// Example usage functions
export const exampleGameplay = () => {
  console.log('=== Game Engine Example ===');

  // Get current word
  const currentWord = gameEngine.getCurrentWord();
  console.log('Current word:', currentWord);

  // Check if hint is available
  console.log('Can use hint:', gameEngine.canUseHint());
  console.log('Remaining hints:', gameEngine.getRemainingHints());

  // Submit correct answer
  console.log('\n--- Submitting correct answer ---');
  const isCorrect = gameEngine.submitAnswer('example');
  console.log('Answer correct:', isCorrect);

  // Get game stats
  const stats = gameEngine.getGameStats();
  console.log('Game stats:', stats);

  // Use a hint
  console.log('\n--- Using hint ---');
  const hintUsed = gameEngine.useHint();
  console.log('Hint used:', hintUsed);

  // Get partial word
  const partialWord = gameEngine.getPartialWord(2);
  console.log('Partial word:', partialWord);

  // Get progress
  const progress = gameEngine.getProgressPercentage();
  console.log('Progress:', progress + '%');

  // Check if game is completed
  console.log('Game completed:', gameEngine.isGameCompleted());

  // Get configuration
  const config = gameEngine.getConfig();
  console.log('Game configuration:', config);
};

// Example of different game modes
export const createEasyMode = () => {
  return new GameEngine(
    exampleGame,
    initialState,
    () => {},
    () => {},
    {
      pointsPerCorrect: 20,
      pointsPerHint: -1,
      maxHints: 5,
      timeBonus: false,
      streakMultiplier: false,
    }
  );
};

export const createHardMode = () => {
  return new GameEngine(
    exampleGame,
    initialState,
    () => {},
    () => {},
    {
      pointsPerCorrect: 5,
      pointsPerHint: -5,
      maxHints: 1,
      timeBonus: true,
      streakMultiplier: true,
    }
  );
};

// Example of dynamic configuration updates
export const updateGameDifficulty = (
  engine: GameEngine,
  difficulty: 'easy' | 'medium' | 'hard'
) => {
  const configs = {
    easy: { pointsPerCorrect: 20, maxHints: 5, pointsPerHint: -1 },
    medium: { pointsPerCorrect: 10, maxHints: 3, pointsPerHint: -2 },
    hard: { pointsPerCorrect: 5, maxHints: 1, pointsPerHint: -5 },
  };

  engine.updateConfig(configs[difficulty]);
  console.log(`Game difficulty updated to: ${difficulty}`);
};
