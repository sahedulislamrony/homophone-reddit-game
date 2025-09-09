export type Pages =
  | 'home'
  | 'daily-challenges'
  | 'game'
  | 'game-result'
  | 'leaderboard'
  | 'how-to-play'
  | 'stats';

export interface RouterContextType {
  currentPage: Pages;
  goto: (page: Pages, params?: Record<string, string>) => void;
  getParams: () => Record<string, string>;
}
