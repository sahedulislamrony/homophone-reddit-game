import { useRouter } from '@client/contexts/RouterContext';
import HomePage from '@client/pages/HomePage';
import LeaderboardPage from '@client/pages/LeaderboardPage';
import HowToPlayPage from '@client/pages/HowToPlayPage';
import StatsPage from '@client/pages/StatsPage';
import GamePage from '@client/pages/GamePage';
import DailyChallengePage from '@client/pages/DailyChallengePage';
import GameResultPage from '@client/pages/GameResultPage';

export function AppRouter() {
  const { currentPage } = useRouter();

  switch (currentPage) {
    case 'home':
      return <HomePage />;
    case 'daily-challenges':
      return <DailyChallengePage />;
    case 'game':
      return <GamePage />;
    case 'game-result':
      return <GameResultPage />;
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
