export type GameObject = {
  themeName: string;
  content: string;
  correctWords: string[];
  themeBgImage: string;
  hints: string[]; // 4-10 hints per game
  initialPoints: number;
};

export type GameState = {
  currentWordIndex: number;
  userAnswers: string[];
  score: number;
  hintsUsed: number;
  gems: number; // User's gem currency
  freeHintsUsed: number; // Track free hints used (max 3)
  isCompleted: boolean;
};

export type LeaderboardEntry = {
  rank: number;
  username: string;
  points: number;
  date?: string;
};

export type GameFeedback = {
  type: 'correct' | 'wrong' | 'hint';
  message: string;
  points?: number;
};

// New structured game data types
export type ThemeData = {
  themeId: string;
  themeName: string;
  content: string;
  correctWords: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  gemsEarn: number;
  pointPerCorrectWord: number;
  themeBgImage: string;
  hints: string[];
  isLocked?: boolean;
  isCompleted?: boolean;
  completedAt?: string;
  score?: number;
};

export type DailyData = {
  date: string; // "yyyy-mm-dd" format
  themes: ThemeData[];
};

export type GameData = {
  dailyData: DailyData[];
};
