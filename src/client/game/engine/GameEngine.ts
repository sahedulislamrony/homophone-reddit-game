import { GameObject, GameState, GameFeedback } from '@shared/types/game';

export interface GameEngineConfig {
  pointsPerCorrect: number; // Base points for first correct answer
  pointsPerHint: number; // Points deducted for using hints (negative value)
  maxHints: number; // Maximum hints allowed per game
  timeBonus: boolean; // Enable time-based bonuses
  streakMultiplier: boolean; // Enable progressive streak multipliers (1x, 2x, 3x, etc.)
}

export class GameEngine {
  private gameObject: GameObject;
  private gameState: GameState;
  private onStateChange: (state: GameState) => void;
  private onFeedback: (feedback: GameFeedback) => void;
  private config: GameEngineConfig;
  private startTime: number;
  private currentStreak: number = 0;

  constructor(
    gameObject: GameObject,
    initialState: GameState,
    onStateChange: (state: GameState) => void,
    onFeedback: (feedback: GameFeedback) => void,
    config: Partial<GameEngineConfig> = {}
  ) {
    this.gameObject = gameObject;
    this.gameState = initialState;
    this.onStateChange = onStateChange;
    this.onFeedback = onFeedback;
    this.startTime = Date.now();

    // Default configuration
    this.config = {
      pointsPerCorrect: 10, // Base points: 10 for first correct answer
      pointsPerHint: -2, // -2 points per hint used
      maxHints: 3, // Maximum 3 hints per game
      timeBonus: true, // Enable time bonuses
      streakMultiplier: true, // Enable progressive multipliers (1x, 2x, 3x, 4x...)
      ...config,
    };
  }

  getCurrentWord(): string | null {
    // Return a random remaining word for display purposes
    const remainingWords = this.gameObject.correctWords.filter(
      (word) =>
        !this.gameState.userAnswers.some((answer) => answer.toLowerCase() === word.toLowerCase())
    );
    return remainingWords.length > 0 ? (remainingWords[0] ?? null) : null;
  }

  isLastWord(): boolean {
    return this.gameState.userAnswers.length >= this.gameObject.correctWords.length - 1;
  }

  isGameCompleted(): boolean {
    return this.gameState.isCompleted;
  }

  getGameState(): GameState {
    return { ...this.gameState };
  }

  getGameObject(): GameObject {
    return { ...this.gameObject };
  }

  submitAnswer(userInput: string): boolean {
    if (!userInput.trim()) {
      this.onFeedback({
        type: 'wrong',
        message: 'Please enter a word before submitting.',
      });
      return false;
    }

    // Check if word has already been submitted
    if (
      this.gameState.userAnswers.some((answer) => answer.toLowerCase() === userInput.toLowerCase())
    ) {
      this.onFeedback({
        type: 'wrong',
        message: 'You have already submitted this word! Try a different one.',
      });
      return false;
    }

    // Check if the submitted word is one of the correct words
    const correctWord = this.gameObject.correctWords.find(
      (word) => word.toLowerCase() === userInput.toLowerCase()
    );

    if (!correctWord) {
      this.onFeedback({
        type: 'wrong',
        message: 'Wrong! Try again or use a hint.',
      });
      this.currentStreak = 0;
      return false;
    }

    // Word is correct and not previously submitted
    let points = 0;

    // Calculate base points with progressive multiplier
    // First correct: min points (1x)
    // Second consecutive: min points * 2
    // Third consecutive: min points * 3
    // And so on...
    const multiplier = this.currentStreak + 1; // +1 because we increment streak after this
    points = this.config.pointsPerCorrect * multiplier;

    // Add time bonus if enabled
    if (this.config.timeBonus) {
      const timeElapsed = Date.now() - this.startTime;
      const timeBonus = Math.max(0, Math.floor(30 - timeElapsed / 1000));
      points += timeBonus;
    }

    this.currentStreak++;

    // Update game state
    this.gameState = {
      ...this.gameState,
      userAnswers: [...this.gameState.userAnswers, userInput],
      score: this.gameState.score + points,
      currentWordIndex: this.gameState.currentWordIndex + 1,
      isCompleted: this.gameState.userAnswers.length + 1 >= this.gameObject.correctWords.length,
    };

    // Provide feedback
    const feedback: GameFeedback = {
      type: 'correct',
      message: `Correct! You found "${correctWord}". You earned ${points} points (${multiplier}x multiplier!)`,
      points,
    };

    this.onStateChange(this.gameState);
    this.onFeedback(feedback);

    return true;
  }

  useHint(): boolean {
    // Check if all words have been found
    if (this.gameState.userAnswers.length >= this.gameObject.correctWords.length) {
      this.onFeedback({
        type: 'hint',
        message: 'All words have been found! No more hints needed.',
      });
      return false;
    }

    // Check if max hints reached
    if (this.gameState.hintsUsed >= this.config.maxHints) {
      this.onFeedback({
        type: 'hint',
        message: `You've used all ${this.config.maxHints} hints!`,
      });
      return false;
    }

    // Get remaining words that haven't been found
    const remainingWords = this.gameObject.correctWords.filter(
      (word) =>
        !this.gameState.userAnswers.some((answer) => answer.toLowerCase() === word.toLowerCase())
    );

    if (remainingWords.length === 0) {
      this.onFeedback({
        type: 'hint',
        message: 'All words have been found!',
      });
      return false;
    }

    // Deduct points for using hint
    const hintPenalty = Math.abs(this.config.pointsPerHint);
    this.gameState = {
      ...this.gameState,
      hintsUsed: this.gameState.hintsUsed + 1,
      score: Math.max(0, this.gameState.score - hintPenalty),
    };

    // Reset streak when using hint
    this.currentStreak = 0;

    // Generate hint for a random remaining word
    const randomWord = remainingWords[Math.floor(Math.random() * remainingWords.length)];
    if (!randomWord) return false;

    const hintType = this.gameState.hintsUsed;
    let hintMessage = '';

    switch (hintType) {
      case 1:
        hintMessage = `Hint 1: One of the remaining words starts with "${randomWord[0]}" and has ${randomWord.length} letters.`;
        break;
      case 2:
        hintMessage = `Hint 2: One of the remaining words ends with "${randomWord.slice(-1)}" and rhymes with "${this.getRhymingWord(randomWord)}".`;
        break;
      case 3:
        hintMessage = `Hint 3: One of the remaining words is "${randomWord}".`;
        break;
      default:
        hintMessage = `Hint: One of the remaining words starts with "${randomWord[0]}" and has ${randomWord.length} letters.`;
    }

    const feedback: GameFeedback = {
      type: 'hint',
      message: hintMessage,
    };

    this.onStateChange(this.gameState);
    this.onFeedback(feedback);

    return true;
  }

  resetGame(): void {
    this.gameState = {
      currentWordIndex: 0,
      userAnswers: [],
      score: 0,
      hintsUsed: 0,
      isCompleted: false,
    };
    this.currentStreak = 0;
    this.startTime = Date.now();
    this.onStateChange(this.gameState);
  }

  // Skip current word (for future implementation)
  skipWord(): boolean {
    if (this.gameState.isCompleted) return false;

    // In random mode, skipping doesn't make sense as any word can be submitted
    this.onFeedback({
      type: 'hint',
      message: 'You can submit any remaining word in any order!',
    });

    return false;
  }

  // Utility method to check if a word is incorrect in the content
  isWordIncorrect(word: string): boolean {
    return this.gameObject.correctWords.some((correctWord) =>
      word.toLowerCase().includes(correctWord.toLowerCase().slice(0, 3))
    );
  }

  // Get progress percentage
  getProgressPercentage(): number {
    return (this.gameState.userAnswers.length / this.gameObject.correctWords.length) * 100;
  }

  // Get game statistics
  getGameStats() {
    const timeElapsed = Date.now() - this.startTime;
    const wordsPerMinute = this.gameState.userAnswers.length / (timeElapsed / 60000);
    const accuracy =
      this.gameState.userAnswers.length /
      (this.gameState.userAnswers.length + this.gameState.hintsUsed);

    return {
      timeElapsed,
      wordsPerMinute: Math.round(wordsPerMinute * 100) / 100,
      accuracy: Math.round(accuracy * 100) / 100,
      currentStreak: this.currentStreak,
      hintsUsed: this.gameState.hintsUsed,
      score: this.gameState.score,
      wordsFound: this.gameState.userAnswers.length,
      totalWords: this.gameObject.correctWords.length,
    };
  }

  // Check if hint is available
  canUseHint(): boolean {
    return this.gameState.hintsUsed < this.config.maxHints;
  }

  // Get remaining hints
  getRemainingHints(): number {
    return Math.max(0, this.config.maxHints - this.gameState.hintsUsed);
  }

  // Get current word with partial reveal (for advanced hints)
  getPartialWord(revealCount: number = 2): string {
    const currentWord = this.getCurrentWord();
    if (!currentWord) return '';

    const revealed = currentWord.slice(0, revealCount);
    const hidden = '*'.repeat(currentWord.length - revealCount);
    return revealed + hidden;
  }

  // Private helper method for rhyming words
  private getRhymingWord(word: string): string {
    const rhymes: { [key: string]: string } = {
      'great': 'late',
      'knew': 'blue',
      'rode': 'code',
      'through': 'blue',
      'Harry': 'marry',
      'astronaut': 'about',
    };

    return rhymes[word] || 'something';
  }

  // Update configuration
  updateConfig(newConfig: Partial<GameEngineConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  // Get current configuration
  getConfig(): GameEngineConfig {
    return { ...this.config };
  }

  // Get remaining words that haven't been found
  getRemainingWords(): string[] {
    return this.gameObject.correctWords.filter(
      (word) =>
        !this.gameState.userAnswers.some((answer) => answer.toLowerCase() === word.toLowerCase())
    );
  }

  // Get found words
  getFoundWords(): string[] {
    return [...this.gameState.userAnswers];
  }

  // Check if a specific word has been found
  isWordFound(word: string): boolean {
    return this.gameState.userAnswers.some((answer) => answer.toLowerCase() === word.toLowerCase());
  }

  // Get current streak multiplier for next correct answer
  getCurrentMultiplier(): number {
    return this.currentStreak + 1;
  }

  // Get streak information for display
  getStreakInfo() {
    return {
      currentStreak: this.currentStreak,
      nextMultiplier: this.getCurrentMultiplier(),
      basePoints: this.config.pointsPerCorrect,
      nextPoints: this.config.pointsPerCorrect * this.getCurrentMultiplier(),
    };
  }
}
