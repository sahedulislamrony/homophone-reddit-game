import { GameEngine } from '../engine/GameEngine';
import { GameObject, GameState } from '@shared/types/game';

// Example demonstrating the new hint system
export function demonstrateHintSystem() {
  // Create a sample game with hints
  const gameObject: GameObject = {
    themeName: 'Harry Potter',
    content: 'Hary was a grate wizard who new many spells. He road a broom threw the castle halls.',
    correctWords: ['Harry', 'great', 'knew', 'rode', 'through'],
    themeBgImage: 'placeholder',
    hints: [
      "The main character's name is misspelled",
      'A word meaning "excellent" or "wonderful"',
      'A word meaning "understood" or "was aware"',
      'A word meaning "traveled on horseback"',
      'A word meaning "from one side to the other"',
      'Look for words that sound like common English words',
      'The first word starts with "H"',
      'One word rhymes with "late"',
    ],
  };

  // Initial game state with some gems
  const initialState: GameState = {
    currentWordIndex: 0,
    userAnswers: [],
    score: 0,
    hintsUsed: 0,
    gems: 5, // User starts with 5 gems
    freeHintsUsed: 0,
    isCompleted: false,
  };

  // Create game engine
  const gameEngine = new GameEngine(
    gameObject,
    initialState,
    (state) => console.log('State changed:', state),
    (feedback) => console.log('Feedback:', feedback)
  );

  console.log('=== Hint System Demo ===');
  console.log('Initial state:', gameEngine.getGameState());
  console.log('Hint info:', gameEngine.getHintInfo());

  // Test free hints
  console.log('\n--- Testing Free Hints ---');
  for (let i = 0; i < 4; i++) {
    const canUse = gameEngine.canUseHint();
    console.log(`Can use hint ${i + 1}:`, canUse);
    if (canUse) {
      gameEngine.useHint();
    }
  }

  // Test gem-based hints
  console.log('\n--- Testing Gem-based Hints ---');
  for (let i = 0; i < 5; i++) {
    const canUse = gameEngine.canUseHint();
    console.log(`Can use hint ${i + 5}:`, canUse);
    if (canUse) {
      gameEngine.useHint();
    }
  }

  console.log('\nFinal state:', gameEngine.getGameState());
  console.log('Final hint info:', gameEngine.getHintInfo());
}

// Run the demo if this file is executed directly
if (typeof window === 'undefined') {
  demonstrateHintSystem();
}
