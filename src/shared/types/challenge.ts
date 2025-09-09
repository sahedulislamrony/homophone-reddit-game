export type ChallengeLevel = {
  id: string;
  themeName: string;
  content: string;
  correctWords: string[];
  themeBgImage: string;
  difficulty: 'easy' | 'medium' | 'hard';
  gemReward: number;
  isLocked: boolean;
  isCompleted: boolean;
  completedAt?: string;
  score?: number;
};

export type DailyChallenge = {
  date: string; // YYYY-MM-DD format
  levels: ChallengeLevel[];
  totalGems: number;
  completedLevels: number;
  isFullyCompleted: boolean;
};

export type UserProgress = {
  completedChallenges: string[]; // Array of challenge IDs
  totalGems: number;
  currentStreak: number;
  lastPlayedDate: string;
  unlockedThemes: string[];
};

export type GemTransaction = {
  id: string;
  type: 'earned' | 'spent';
  amount: number;
  reason: string;
  timestamp: string;
  challengeId?: string;
};
