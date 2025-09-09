# GameEngine Documentation

The `GameEngine` class is the core logic component that handles all game mechanics, scoring, and state management for the homophone game.

## 🚀 Features

### Core Functionality

- **Answer Validation**: Validates user input against correct words
- **Scoring System**: Configurable point system with bonuses and penalties
- **Hint System**: Progressive hint system with multiple hint types
- **Streak Tracking**: Tracks consecutive correct answers for bonus points
- **Time Bonus**: Optional time-based scoring bonuses
- **Progress Tracking**: Monitors game completion and progress

### Advanced Features

- **Configurable Difficulty**: Easy, medium, and hard modes
- **Game Statistics**: Tracks performance metrics
- **Word Skipping**: Option to skip difficult words
- **Partial Word Reveals**: Advanced hint system
- **Dynamic Configuration**: Runtime configuration updates

## 📋 API Reference

### Constructor

```typescript
new GameEngine(
  gameObject: GameObject,
  initialState: GameState,
  onStateChange: (state: GameState) => void,
  onFeedback: (feedback: GameFeedback) => void,
  config?: Partial<GameEngineConfig>
)
```

### Configuration Options

```typescript
interface GameEngineConfig {
  pointsPerCorrect: number; // Points awarded for correct answers (default: 10)
  pointsPerHint: number; // Points deducted for using hints (default: -2)
  maxHints: number; // Maximum hints per word (default: 3)
  timeBonus: boolean; // Enable time-based bonuses (default: true)
  streakMultiplier: boolean; // Enable streak multipliers (default: true)
}
```

### Core Methods

#### Game Control

- `submitAnswer(userInput: string): boolean` - Submit an answer and get validation result
- `useHint(): boolean` - Use a hint for the current word
- `skipWord(): boolean` - Skip the current word
- `resetGame(): void` - Reset the game to initial state

#### State Queries

- `getCurrentWord(): string | null` - Get the current word to find
- `isLastWord(): boolean` - Check if current word is the last one
- `isGameCompleted(): boolean` - Check if game is completed
- `getGameState(): GameState` - Get current game state
- `getGameObject(): GameObject` - Get current game object

#### Hint System

- `canUseHint(): boolean` - Check if hint is available
- `getRemainingHints(): number` - Get number of remaining hints
- `getPartialWord(revealCount?: number): string` - Get partially revealed word

#### Statistics & Progress

- `getGameStats()` - Get comprehensive game statistics
- `getProgressPercentage(): number` - Get completion percentage
- `isWordIncorrect(word: string): boolean` - Check if word is incorrect in content

#### Configuration

- `updateConfig(newConfig: Partial<GameEngineConfig>): void` - Update game configuration
- `getConfig(): GameEngineConfig` - Get current configuration

## 🎮 Usage Examples

### Basic Usage

```typescript
import { GameEngine } from './engine/GameEngine';

const engine = new GameEngine(
  gameObject,
  initialState,
  (newState) => console.log('State updated:', newState),
  (feedback) => console.log('Feedback:', feedback)
);

// Submit an answer
const isCorrect = engine.submitAnswer('correct');

// Use a hint
const hintUsed = engine.useHint();

// Check progress
const progress = engine.getProgressPercentage();
```

### Advanced Configuration

```typescript
// Create hard mode game
const hardModeEngine = new GameEngine(gameObject, initialState, onStateChange, onFeedback, {
  pointsPerCorrect: 5,
  pointsPerHint: -5,
  maxHints: 1,
  timeBonus: true,
  streakMultiplier: true,
});

// Update configuration during gameplay
engine.updateConfig({
  pointsPerCorrect: 15,
  maxHints: 5,
});
```

### Game Statistics

```typescript
const stats = engine.getGameStats();
console.log({
  timeElapsed: stats.timeElapsed,
  wordsPerMinute: stats.wordsPerMinute,
  accuracy: stats.accuracy,
  currentStreak: stats.currentStreak,
  score: stats.score,
});
```

## 🎯 Scoring System

### Base Scoring

- **Correct Answer**: `pointsPerCorrect` points (default: 10)
- **Hint Usage**: `pointsPerHint` points deducted (default: -2)
- **Time Bonus**: Up to 30 points for quick answers (if enabled)
- **Streak Multiplier**: 10% bonus per consecutive correct answer

### Example Scoring

- Correct answer: 10 points
- With 3x streak: 13 points (10 + 30% bonus)
- With time bonus: +15 points (answered in 15 seconds)
- **Total**: 28 points

## 🔧 Hint System

### Hint Types

1. **Hint 1**: First letter and word length
2. **Hint 2**: Last letter and rhyming word
3. **Hint 3**: Complete word reveal

### Hint Progression

```typescript
// Check if hint is available
if (engine.canUseHint()) {
  const success = engine.useHint();
  if (success) {
    console.log('Hint used successfully');
  }
}
```

## 📊 Game Statistics

The engine tracks comprehensive statistics:

```typescript
interface GameStats {
  timeElapsed: number; // Total time in milliseconds
  wordsPerMinute: number; // Performance metric
  accuracy: number; // Correct answers ratio
  currentStreak: number; // Current consecutive correct answers
  hintsUsed: number; // Total hints used
  score: number; // Current total score
}
```

## 🎨 Integration with React

The GameEngine is designed to work seamlessly with React components:

```typescript
const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);

useEffect(() => {
  const engine = new GameEngine(
    gameObject,
    initialState,
    setGameState, // React state setter
    setFeedback, // React state setter
    config
  );
  setGameEngine(engine);
}, []);

// Use in event handlers
const handleSubmit = () => {
  if (gameEngine) {
    const isCorrect = gameEngine.submitAnswer(userInput);
    if (isCorrect) {
      setUserInput('');
    }
  }
};
```

## 🔄 State Management

The GameEngine uses a callback-based state management system:

- **onStateChange**: Called whenever game state changes
- **onFeedback**: Called when user feedback is needed

This allows for reactive updates in React components without tight coupling.

## 🚀 Performance Considerations

- **Efficient State Updates**: Only updates state when necessary
- **Memory Management**: Proper cleanup of callbacks and references
- **Configurable Limits**: Prevents infinite loops and excessive resource usage
- **Type Safety**: Full TypeScript support for compile-time error checking

## 🧪 Testing

The GameEngine is designed to be easily testable:

```typescript
// Mock callbacks for testing
const mockOnStateChange = jest.fn();
const mockOnFeedback = jest.fn();

const engine = new GameEngine(testGameObject, testInitialState, mockOnStateChange, mockOnFeedback);

// Test game logic
expect(engine.submitAnswer('correct')).toBe(true);
expect(mockOnStateChange).toHaveBeenCalled();
expect(mockOnFeedback).toHaveBeenCalled();
```
