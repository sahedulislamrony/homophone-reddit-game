export type GameObject = {
  themeName: string;
  content: string;
  correctWords: string[];
  themeBgImage: string;
};

export type GameState = {
  currentWordIndex: number;
  userAnswers: string[];
  score: number;
  hintsUsed: number;
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
