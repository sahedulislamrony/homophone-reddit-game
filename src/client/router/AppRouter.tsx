import { useRouter } from '@client/contexts/RouterContext';
import HomePage from '@client/pages/HomePage';
import LeaderboardPage from '@client/pages/LeaderboardPage';
import HowToPlayPage from '@client/pages/HowToPlayPage';
import StatsPage from '@client/pages/StatsPage';
import GamePage from '@client/pages/GamePage';

export function AppRouter() {
  const { currentPage } = useRouter();

  switch (currentPage) {
    case 'home':
      return <HomePage />;
    case 'game':
      return <GamePage />;
    case 'leaderboard':
      return <LeaderboardPage />;
    case 'how-to-play':
      return <HowToPlayPage />;
    case 'stats':
      return <StatsPage />;
    default:
      return <HomePage />;
  }
}
