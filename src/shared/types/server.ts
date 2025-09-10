// Server-side data types

export type UserRole = 'player' | 'admin';

export type UserData = {
  username: string;
  role: UserRole;
  gems: number;
  totalPoints: number;
  dailyPoints: number;
  currentStreak: number;
  lastPlayedDate: string;
  createdAt: string;
  isActive: boolean;
};

export type GameResult = {
  id: string;
  username: string;
  challengeId: string;
  date: string; // YYYY-MM-DD
  score: number;
  hintsUsed: number;
  freeHintsUsed: number;
  gemsSpent: number;
  gemsEarned: number;
  completedAt: string;
  timeSpent: number; // in seconds
  difficulty: 'easy' | 'medium' | 'hard';
  themeName: string;
};

export type LeaderboardEntry = {
  rank: number;
  username: string;
  totalPoints: number;
  dailyPoints: number;
  currentStreak: number;
  gamesPlayed: number;
  lastPlayedDate: string;
};

export type DailyLeaderboard = {
  date: string; // YYYY-MM-DD
  entries: LeaderboardEntry[];
  totalPlayers: number;
  lastUpdated: string;
};

export type UserStats = {
  username: string;
  totalGames: number;
  totalPoints: number;
  dailyPoints: number;
  currentStreak: number;
  bestStreak: number;
  averageScore: number;
  totalHintsUsed: number;
  totalGemsEarned: number;
  totalGemsSpent: number;
  favoriteTheme: string;
  lastPlayedDate: string;
  gamesByDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  gamesByTheme: { [theme: string]: number };
};

export type GameTransaction = {
  id: string;
  username: string;
  type: 'gem_earned' | 'gem_spent' | 'points_earned' | 'hint_used';
  amount: number;
  reason: string;
  gameId?: string;
  challengeId?: string;
  timestamp: string;
};

// Redis key patterns
export const REDIS_KEYS = {
  USER: (username: string) => `user:${username}`,
  USER_GEMS: (username: string) => `user:${username}:gems`,
  USER_POINTS: (username: string) => `user:${username}:points`,
  USER_STREAK: (username: string) => `user:${username}:streak`,
  GAME_RESULT: (gameId: string) => `game:${gameId}`,
  USER_GAMES: (username: string) => `user:${username}:games`,
  DAILY_LEADERBOARD: (date: string) => `leaderboard:daily:${date}`,
  ALL_TIME_LEADERBOARD: 'leaderboard:alltime',
  USER_STATS: (username: string) => `user:${username}:stats`,
  TRANSACTIONS: (username: string) => `user:${username}:transactions`,
  DAILY_POINTS: (username: string, date: string) => `user:${username}:daily:${date}`,
} as const;
