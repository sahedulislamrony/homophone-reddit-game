export interface GameParams {
  level: string;
}

export interface SearchParams {
  subLevel?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface LeaderboardFilters {
  difficulty: 'easy' | 'medium' | 'hard';
  timeframe: 'all-time' | 'today';
}
