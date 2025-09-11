import { GameObject, GameState, GameFeedback } from '@shared/types/game';

export interface GameEngineConfig {
  pointsPerCorrect: number; // Base points for first correct answer (default: 10)
  pointsPerHint: number; // Points deducted for using hints after free hints (negative value)
  maxFreeHints: number; // Maximum free hints allowed per game (3)
  gemsPerHint: number; // Gems required for additional hints (1 gem = 3 hints)
  timeBonus: boolean; // Enable time-based bonuses
  streakMultiplier: boolean; // Enable progressive streak multipliers with half-value bonus
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

    // Get base points from theme data or use default
    const themePoints = (gameObject as GameObject & { initialPoints?: number }).initialPoints || 10;

    // Default configuration
    this.config = {
      pointsPerCorrect: themePoints, // Use theme's pointPerCorrectWord or default to 10
      pointsPerHint: -2, // -2 points per hint used after free hints
      maxFreeHints: 3, // Maximum 3 free hints per game
      gemsPerHint: 1, // 1 gem = 3 additional hints
      timeBonus: false, // Disabled for consistent scoring
      streakMultiplier: true, // Enable progressive multipliers with half-value bonus
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

    // Calculate points with new streak system:
    // 1st correct: basePoints (e.g., 10)
    // 2nd consecutive: basePoints + (basePoints * 0.5 * 2) = 10 + 10 = 20
    // 3rd consecutive: basePoints + (basePoints * 0.5 * 3) = 10 + 15 = 25
    // 4th consecutive: basePoints + (basePoints * 0.5 * 4) = 10 + 20 = 30
    // Formula: basePoints + (basePoints * 0.5 * streak) for streak > 1, basePoints for streak = 1
    const streak = this.currentStreak + 1; // +1 because we increment streak after this
    const basePoints = this.config.pointsPerCorrect;

    if (this.config.streakMultiplier && streak > 1) {
      // Streak bonus: half of base points multiplied by streak count
      const streakBonus = basePoints * 0.5 * streak;
      points = basePoints + streakBonus;
    } else {
      // First correct answer gets base points only
      points = basePoints;
    }

    // Time bonus removed for consistent scoring
    // Points are now based purely on streak system for predictable results

    this.currentStreak++;

    // Update game state
    this.gameState = {
      ...this.gameState,
      userAnswers: [...this.gameState.userAnswers, userInput],
      score: this.gameState.score + points,
      currentWordIndex: this.gameState.currentWordIndex + 1,
      isCompleted: this.gameState.userAnswers.length + 1 >= this.gameObject.correctWords.length,
    };

    // Provide feedback with detailed breakdown
    const streakText = streak > 1 ? ` (${streak}x streak!)` : '';
    const feedback: GameFeedback = {
      type: 'correct',
      message: `Correct! You found "${correctWord}". You earned ${Math.round(points)} points${streakText}`,
      points: Math.round(points),
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

    // Check if we have any hints available
    if (this.gameObject.hints.length === 0) {
      this.onFeedback({
        type: 'hint',
        message: 'No hints available for this game.',
      });
      return false;
    }

    // Check if we've used all available hints
    if (this.gameState.hintsUsed >= this.gameObject.hints.length) {
      this.onFeedback({
        type: 'hint',
        message: "You've used all available hints for this game!",
      });
      return false;
    }

    // Determine if this is a free hint or requires gems
    const isFreeHint = this.gameState.freeHintsUsed < this.config.maxFreeHints;
    const hintsFromGems = Math.floor((this.gameState.hintsUsed - this.gameState.freeHintsUsed) / 3);
    const remainingGems = this.gameState.gems - hintsFromGems;

    if (!isFreeHint) {
      // Check if we have enough gems for additional hints
      if (remainingGems < this.config.gemsPerHint) {
        this.onFeedback({
          type: 'hint',
          message: `You need ${this.config.gemsPerHint} gem(s) to get more hints. You have ${remainingGems} gems available.`,
        });
        return false;
      }
    }

    // Get the next hint from the game's hint array
    const hintIndex = this.gameState.hintsUsed;
    const hintMessage = this.gameObject.hints[hintIndex];

    if (!hintMessage) {
      this.onFeedback({
        type: 'hint',
        message: 'No more hints available.',
      });
      return false;
    }

    // Update game state
    const newState = {
      ...this.gameState,
      hintsUsed: this.gameState.hintsUsed + 1,
    };

    if (isFreeHint) {
      // Free hint - no cost
      newState.freeHintsUsed = this.gameState.freeHintsUsed + 1;
    } else {
      // Gem-based hint - deduct gems and points
      newState.gems = Math.max(0, this.gameState.gems - this.config.gemsPerHint);
      newState.score = Math.max(0, this.gameState.score + this.config.pointsPerHint);
    }

    this.gameState = newState;

    // Reset streak when using hint
    this.currentStreak = 0;

    // Create feedback message
    const feedback: GameFeedback = {
      type: 'hint',
      message: isFreeHint
        ? `Free Hint ${this.gameState.freeHintsUsed}: ${hintMessage}`
        : `Gem Hint: ${hintMessage} (Cost: ${this.config.gemsPerHint} gem${this.config.gemsPerHint > 1 ? 's' : ''})`,
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
      gems: this.gameState.gems, // Preserve gems across games
      freeHintsUsed: 0,
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
    // Check if all words found
    if (this.gameState.userAnswers.length >= this.gameObject.correctWords.length) {
      return false;
    }

    // Check if we've used all available hints
    if (this.gameState.hintsUsed >= this.gameObject.hints.length) {
      return false;
    }

    // Check if we have free hints or gems for additional hints
    const isFreeHint = this.gameState.freeHintsUsed < this.config.maxFreeHints;
    if (isFreeHint) {
      return true;
    }

    // Check if we have gems for additional hints
    const hintsFromGems = Math.floor((this.gameState.hintsUsed - this.gameState.freeHintsUsed) / 3);
    const remainingGems = this.gameState.gems - hintsFromGems;
    return remainingGems >= this.config.gemsPerHint;
  }

  // Get remaining free hints
  getRemainingFreeHints(): number {
    return Math.max(0, this.config.maxFreeHints - this.gameState.freeHintsUsed);
  }

  // Get remaining total hints (free + gem-based)
  getRemainingHints(): number {
    const freeHints = this.getRemainingFreeHints();
    const hintsFromGems = Math.floor((this.gameState.hintsUsed - this.gameState.freeHintsUsed) / 3);
    const remainingGems = this.gameState.gems - hintsFromGems;
    const gemHints = Math.floor(remainingGems / this.config.gemsPerHint) * 3;

    return freeHints + gemHints;
  }

  // Get gems available for hints
  getAvailableGems(): number {
    const hintsFromGems = Math.floor((this.gameState.hintsUsed - this.gameState.freeHintsUsed) / 3);
    return this.gameState.gems - hintsFromGems;
  }

  // Add gems to user's account
  addGems(amount: number): void {
    this.gameState = {
      ...this.gameState,
      gems: this.gameState.gems + amount,
    };
    this.onStateChange(this.gameState);
  }

  // Get hint information for display
  getHintInfo() {
    const freeHints = this.getRemainingFreeHints();
    const availableGems = this.getAvailableGems();
    const gemHints = Math.floor(availableGems / this.config.gemsPerHint) * 3;

    return {
      freeHints,
      availableGems,
      gemHints,
      totalHints: freeHints + gemHints,
      canUseFreeHint: freeHints > 0,
      canUseGemHint: availableGems >= this.config.gemsPerHint,
      gemsPerHint: this.config.gemsPerHint,
    };
  }

  // Get current word with partial reveal (for advanced hints)
  getPartialWord(revealCount: number = 2): string {
    const currentWord = this.getCurrentWord();
    if (!currentWord) return '';

    const revealed = currentWord.slice(0, revealCount);
    const hidden = '*'.repeat(currentWord.length - revealCount);
    return revealed + hidden;
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
    const nextStreak = this.getCurrentMultiplier();
    const basePoints = this.config.pointsPerCorrect;

    let nextPoints = basePoints;
    if (this.config.streakMultiplier && nextStreak > 1) {
      const streakBonus = basePoints * 0.5 * nextStreak;
      nextPoints = basePoints + streakBonus;
    }

    return {
      currentStreak: this.currentStreak,
      nextMultiplier: nextStreak,
      basePoints: basePoints,
      nextPoints: Math.round(nextPoints),
      streakBonus:
        this.config.streakMultiplier && nextStreak > 1
          ? Math.round(basePoints * 0.5 * nextStreak)
          : 0,
    };
  }
}
