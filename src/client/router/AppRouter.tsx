import { useRouter } from '@client/contexts/RouterContext';
import HomePage from '@client/pages/HomePage';
import LeaderboardPage from '@client/pages/LeaderboardPage';
import GamePage from '@client/pages/GamePage';
import HowToPlayPage from '@client/pages/HowToPlay';

export function AppRouter() {
  const { currentPage } = useRouter();

  switch (currentPage) {
    case 'home':
      return <HomePage />;
    case 'leaderboard':
      return <LeaderboardPage />;
    case 'game':
      return <GamePage />;
    case 'how-to-play':
      return <HowToPlayPage />;
    default:
      return <HomePage />;
  }
}
