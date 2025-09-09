import {
  ChallengeLevel,
  DailyChallenge,
  UserProgress,
  GemTransaction,
} from '@shared/types/challenge';
import { GameObject } from '@shared/types/game';
import { getChallengesForDate } from './dailyChallengesData';

export class DailyChallengeManager {
  private static instance: DailyChallengeManager;
  private userProgress: UserProgress;
  private gemTransactions: GemTransaction[];

  private constructor() {
    this.userProgress = this.loadUserProgress();
    this.gemTransactions = this.loadGemTransactions();
  }

  static getInstance(): DailyChallengeManager {
    if (!DailyChallengeManager.instance) {
      DailyChallengeManager.instance = new DailyChallengeManager();
    }
    return DailyChallengeManager.instance;
  }

  // Generate daily challenges for a specific date
  generateDailyChallenges(date: string): DailyChallenge {
    // Try to get challenges from raw data first
    const rawData = getChallengesForDate(date);

    if (rawData) {
      // Use raw data if available
      const levels: ChallengeLevel[] = rawData.challenges.map((challenge, index) => {
        // Check if already completed
        const isCompleted = this.userProgress.completedChallenges.includes(challenge.id);
        const isLocked =
          index > 0 &&
          !!this.userProgress?.completedChallenges &&
          !this.userProgress.completedChallenges.includes(rawData.challenges[index - 1]?.id || '');

        const challengeLevel: ChallengeLevel = {
          id: challenge.id,
          themeName: challenge.themeName,
          content: challenge.content,
          correctWords: challenge.correctWords,
          themeBgImage: challenge.themeBgImage,
          difficulty: challenge.difficulty,
          gemReward: challenge.gemReward,
          isLocked,
          isCompleted,
        };

        if (isCompleted) {
          challengeLevel.completedAt = this.getCompletionDate(challenge.id);
          challengeLevel.score = this.getCompletionScore(challenge.id);
        }

        return challengeLevel;
      });

      const completedLevels = levels.filter((level) => level.isCompleted).length;
      const totalGems = levels.reduce(
        (sum, level) => sum + (level.isCompleted ? level.gemReward : 0),
        0
      );

      return {
        date,
        levels,
        totalGems,
        completedLevels,
        isFullyCompleted: completedLevels === levels.length,
      };
    }

    // Fallback to generated challenges if no raw data available
    return this.generateFallbackChallenges(date);
  }

  // Fallback method for generating challenges when no raw data is available
  private generateFallbackChallenges(date: string): DailyChallenge {
    const themes = [
      'Harry Potter',
      'Space Adventure',
      'Ocean Exploration',
      'Medieval Times',
      'Fantasy Quest',
      'Sci-Fi Journey',
      'Mystery Manor',
      'Wild West',
    ];

    const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard'];
    const levels: ChallengeLevel[] = [];

    // Generate 8 challenges (one for each theme)
    themes.forEach((theme, index) => {
      const difficulty = difficulties[index % 3] || 'easy';
      const challengeId = `${date}-${theme.toLowerCase().replace(/\s+/g, '-')}`;

      // Check if already completed
      const isCompleted = this.userProgress.completedChallenges.includes(challengeId);
      const isLocked =
        index > 0 &&
        !!this.userProgress?.completedChallenges &&
        !this.userProgress.completedChallenges.includes(
          `${date}-${themes[index - 1]?.toLowerCase().replace(/\s+/g, '-') || ''}`
        );

      const challengeLevel: ChallengeLevel = {
        id: challengeId,
        themeName: theme,
        content: this.generateContentForTheme(theme),
        correctWords: this.generateCorrectWordsForTheme(theme),
        themeBgImage: this.getThemeImage(theme),
        difficulty,
        gemReward: this.getGemReward(difficulty),
        isLocked,
        isCompleted,
      };

      if (isCompleted) {
        challengeLevel.completedAt = this.getCompletionDate(challengeId);
        challengeLevel.score = this.getCompletionScore(challengeId);
      }

      levels.push(challengeLevel);
    });

    const completedLevels = levels.filter((level) => level.isCompleted).length;
    const totalGems = levels.reduce(
      (sum, level) => sum + (level.isCompleted ? level.gemReward : 0),
      0
    );

    return {
      date,
      levels,
      totalGems,
      completedLevels,
      isFullyCompleted: completedLevels === levels.length,
    };
  }

  // Get today's challenges
  getTodaysChallenges(): DailyChallenge {
    const today = new Date().toISOString().split('T')[0]!;
    return this.generateDailyChallenges(today);
  }

  // Complete a challenge
  completeChallenge(challengeId: string, score: number): boolean {
    const challenge = this.findChallengeById(challengeId);
    if (!challenge || challenge.isLocked || challenge.isCompleted) {
      return false;
    }

    // Mark as completed
    challenge.isCompleted = true;
    challenge.completedAt = new Date().toISOString();
    challenge.score = score;

    // Add to completed challenges
    if (!this.userProgress.completedChallenges.includes(challengeId)) {
      this.userProgress.completedChallenges.push(challengeId);
    }

    // Award gems
    this.awardGems(challenge.gemReward, `Completed ${challenge.themeName} challenge`, challengeId);

    // Unlock next challenge
    this.unlockNextChallenge(challengeId);

    // Update streak
    this.updateStreak();

    this.saveUserProgress();
    this.saveGemTransactions();

    return true;
  }

  // Get user progress
  getUserProgress(): UserProgress {
    return { ...this.userProgress };
  }

  // Get gem balance
  getGemBalance(): number {
    return this.userProgress.totalGems;
  }

  // Get gem transactions
  getGemTransactions(): GemTransaction[] {
    return [...this.gemTransactions];
  }

  // Award gems
  awardGems(amount: number, reason: string, challengeId?: string): void {
    this.userProgress.totalGems += amount;

    const transaction: GemTransaction = {
      id: `gem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'earned',
      amount,
      reason,
      timestamp: new Date().toISOString(),
      ...(challengeId && { challengeId }),
    };

    this.gemTransactions.push(transaction);
  }

  // Spend gems
  spendGems(amount: number, reason: string): boolean {
    if (this.userProgress.totalGems < amount) {
      return false;
    }

    this.userProgress.totalGems -= amount;

    const transaction: GemTransaction = {
      id: `gem-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'spent',
      amount,
      reason,
      timestamp: new Date().toISOString(),
    };

    this.gemTransactions.push(transaction);
    this.saveUserProgress();
    this.saveGemTransactions();

    return true;
  }

  // Convert challenge to game object
  challengeToGameObject(challenge: ChallengeLevel): GameObject {
    return {
      themeName: challenge.themeName,
      content: challenge.content,
      correctWords: challenge.correctWords,
      themeBgImage: challenge.themeBgImage,
    };
  }

  // Private helper methods
  private loadUserProgress(): UserProgress {
    try {
      const saved = localStorage.getItem('userProgress');
      return saved
        ? JSON.parse(saved)
        : {
            completedChallenges: [],
            totalGems: 0,
            currentStreak: 0,
            lastPlayedDate: '',
            unlockedThemes: [],
          };
    } catch {
      return {
        completedChallenges: [],
        totalGems: 0,
        currentStreak: 0,
        lastPlayedDate: '',
        unlockedThemes: [],
      };
    }
  }

  private loadGemTransactions(): GemTransaction[] {
    try {
      const saved = localStorage.getItem('gemTransactions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  }

  private saveUserProgress(): void {
    localStorage.setItem('userProgress', JSON.stringify(this.userProgress));
  }

  private saveGemTransactions(): void {
    localStorage.setItem('gemTransactions', JSON.stringify(this.gemTransactions));
  }

  private findChallengeById(challengeId: string): ChallengeLevel | null {
    const today = new Date().toISOString().split('T')[0]!;
    const challenges = this.generateDailyChallenges(today);
    return challenges.levels.find((level) => level.id === challengeId) || null;
  }

  private unlockNextChallenge(completedChallengeId: string): void {
    const today = new Date().toISOString().split('T')[0]!;
    const challenges = this.generateDailyChallenges(today);
    const completedIndex = challenges.levels.findIndex(
      (level) => level.id === completedChallengeId
    );

    if (completedIndex >= 0 && completedIndex < challenges.levels.length - 1) {
      const nextChallenge = challenges.levels[completedIndex + 1];
      if (nextChallenge) {
        nextChallenge.isLocked = false;
      }
    }
  }

  private updateStreak(): void {
    const today = new Date().toISOString().split('T')[0]!;
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0]!;

    if (this.userProgress.lastPlayedDate === yesterday) {
      this.userProgress.currentStreak++;
    } else if (this.userProgress.lastPlayedDate !== today) {
      this.userProgress.currentStreak = 1;
    }

    this.userProgress.lastPlayedDate = today;
  }

  private getGemReward(difficulty: 'easy' | 'medium' | 'hard'): number {
    switch (difficulty) {
      case 'easy':
        return 5;
      case 'medium':
        return 10;
      case 'hard':
        return 20;
      default:
        return 5;
    }
  }

  private getThemeImage(theme: string): string {
    const themeImages: { [key: string]: string } = {
      'Harry Potter': '/images/harrypotter_bg.jpg',
      'Space Adventure': '/images/space_bg.jpg',
      'Ocean Exploration': '/images/ocean_bg.jpg',
      'Medieval Times': '/images/medieval_bg.jpg',
      'Fantasy Quest': '/images/fantasy_bg.jpg',
      'Sci-Fi Journey': '/images/scifi_bg.jpg',
      'Mystery Manor': '/images/mystery_bg.jpg',
      'Wild West': '/images/wildwest_bg.jpg',
    };
    return themeImages[theme] || 'placeholder';
  }

  private generateContentForTheme(theme: string): string {
    const contentTemplates: { [key: string]: string } = {
      'Harry Potter':
        'Hary was a grate wizard who new many spells. He road a broom threw the castle halls.',
      'Space Adventure':
        'The astronot looked threw the telescope and saw a grate meteor shower. He new it was going to be an amazing sight.',
      'Ocean Exploration':
        'The diver road the current threw the coral reef. She new that the grate barrier reef was home to many fish.',
      'Medieval Times':
        'The knight road his horse threw the forest. He new that grate danger awaited him ahead.',
      'Fantasy Quest':
        'The mage cast a grate spell and new that the dragon would brake threw the castle walls.',
      'Sci-Fi Journey':
        'The pilot road the ship threw the asteroid field. He new that grate precision was required.',
      'Mystery Manor':
        'The detective road threw the clues and new that grate deduction would solve the case.',
      'Wild West':
        'The cowboy road his horse threw the desert. He new that grate courage was needed.',
    };
    return contentTemplates[theme] || 'This is a sample content with some incorrect words to find.';
  }

  private generateCorrectWordsForTheme(theme: string): string[] {
    const wordTemplates: { [key: string]: string[] } = {
      'Harry Potter': ['Harry', 'great', 'knew', 'rode', 'through'],
      'Space Adventure': ['astronaut', 'through', 'great', 'knew'],
      'Ocean Exploration': ['rode', 'through', 'knew', 'great'],
      'Medieval Times': ['rode', 'through', 'knew', 'great'],
      'Fantasy Quest': ['great', 'knew', 'break', 'through'],
      'Sci-Fi Journey': ['rode', 'through', 'knew', 'great'],
      'Mystery Manor': ['rode', 'through', 'knew', 'great'],
      'Wild West': ['rode', 'through', 'knew', 'great'],
    };
    return wordTemplates[theme] || ['example', 'words', 'to', 'find'];
  }

  private getCompletionDate(_challengeId: string): string {
    // This would be stored in a more sophisticated system
    return new Date().toISOString();
  }

  private getCompletionScore(_challengeId: string): number {
    // This would be stored in a more sophisticated system
    return Math.floor(Math.random() * 100) + 50;
  }
}
