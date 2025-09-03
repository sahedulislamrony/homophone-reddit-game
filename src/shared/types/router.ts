export type Page = 'home' | 'game' | 'leaderboard' | 'how-to-play';

export interface RouterContextType {
  currentPage: Page;
  goto: (page: Page) => void;
}
