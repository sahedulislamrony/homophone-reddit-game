export type Pages = 'home' | 'game' | 'leaderboard' | 'how-to-play' | 'stats';

export interface RouterContextType {
  currentPage: Pages;
  goto: (page: Pages) => void;
}
