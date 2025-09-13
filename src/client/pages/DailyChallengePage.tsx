import { useState, useEffect } from 'react';
import { useRouter } from '@client/contexts/RouterContext';
import { useUserContext } from '@client/contexts/UserContext';
import { ChallengeLevel, DailyChallenge } from '@shared/types/challenge';
import { DailyData, ThemeData } from '@shared/types/game';
import NavigationBar from '@client/components/basic/Navigation';
import ChallengeCard from '@client/game/components/ChallengeCard';
import { Calendar, Trophy } from 'lucide-react';
import { userApi } from '@client/utils/api';
import { GameDataConverter } from '@client/utils/GameDataConverter';
import { getDailyData, getCompletionStats, getTotalGemsForDate } from '@client/game/data/gameData';
import { FullScreenLoader } from '@client/components';
import Notice from '@client/components/Notice';
import { getToday } from '@client/services/TimeService';

export default function DailyChallengePage() {
  const router = useRouter();
  const { username, loading: userLoading } = useUserContext();
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [today, setToday] = useState<string>('');

  useEffect(() => {
    const fetchDailyChallenges = async () => {
      try {
        setLoading(true);
        setError(null);

        // Wait for user context to finish loading
        if (userLoading) {
          return;
        }

        if (!username || username === 'anonymous') {
          setError('User not logged in');
          setLoading(false);
          return;
        }

        // Get server date using TimeService
        const serverToday = await getToday();
        console.log('Server today:', serverToday);
        setToday(serverToday);

        const todayData = getDailyData(serverToday);
        if (!todayData) {
          setError('No challenges available for today');
          setLoading(false);
          return;
        }

        // Fetch today's completed games from server using server date
        const todayGames = await userApi.getTodayGames(username, serverToday);

        // Create a map of completed games for quick lookup
        const completedGamesMap = new Map();
        todayGames.forEach((game) => {
          completedGamesMap.set(game.challengeId, game);
        });

        // Update completion status based on server data (without modifying original theme data)
        const updatedThemes = todayData.themes.map((theme: ThemeData) => {
          const completedGame = completedGamesMap.get(theme.themeId);
          const isCompleted = !!completedGame;

          return {
            ...theme, // Keep original theme data intact
            isCompleted,
            completedAt: completedGame?.completedAt || '',
            score: completedGame?.score || 0,
          };
        });

        // Convert ThemeData to ChallengeLevel format for the UI
        const challengeLevels: ChallengeLevel[] =
          GameDataConverter.themesToChallenges(updatedThemes);

        // Create updated daily data with completion status
        const updatedDailyData: DailyData = {
          date: todayData.date,
          themes: updatedThemes,
        };

        const dailyChallenge: DailyChallenge = {
          date: updatedDailyData.date,
          levels: challengeLevels,
          totalGems: getTotalGemsForDate(updatedDailyData.date),
          completedLevels: getCompletionStats(updatedDailyData.date).completed,
          isFullyCompleted: getCompletionStats(updatedDailyData.date).percentage === 100,
        };

        setDailyChallenge(dailyChallenge);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch daily challenges');
        console.error('Error fetching daily challenges:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchDailyChallenges();
  }, [username, userLoading]);

  const handleChallengeClick = (challenge: ChallengeLevel) => {
    if (challenge.isLocked) {
      return;
    }

    if (challenge.isCompleted) {
      // Show completion details or replay option
      return;
    }

    console.log('DailyChallengePage: Navigating to game with challenge:', challenge.id);
    // Navigate to game with this challenge
    router.goto('game', { challengeId: challenge.id });
  };

  const handleViewResult = async (challengeId: string) => {
    try {
      console.log('DailyChallengePage: Fetching result for challenge:', challengeId);

      // Fetch the specific game result from server using username and challengeId
      const gameResult = await userApi.getGameResultByChallengeId(
        username || 'anonymous',
        challengeId
      );

      if (gameResult) {
        console.log('DailyChallengePage: Found game result:', gameResult);
        // Navigate to result page with the actual game result data
        router.goto('game-result', {
          challengeId,
          username: username || 'anonymous',
          gameResult: JSON.stringify(gameResult),
        });
      } else {
        console.warn('DailyChallengePage: No game result found for challenge:', challengeId);
        // Show error or fallback
        setError('No result found for this challenge');
      }
    } catch (error) {
      console.error('DailyChallengePage: Error fetching game result:', error);
      setError('Failed to load challenge result');
    }
  };

  const handleBackToHome = () => {
    router.goto('home');
  };

  if (loading || userLoading) {
    return <FullScreenLoader isLoading={true} variant="challenge" message="Loading challenges" />;
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error loading challenges</div>
          <div className="text-gray-300 mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-yellow-500 text-black rounded-lg hover:bg-yellow-400 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dailyChallenge) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">No challenges available</div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black pb-10">
      {/* Header */}
      <div className="relative z-10 p-6">
        <NavigationBar title="Daily Challenges" onBack={handleBackToHome} />

        {/* Date and Stats */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-white mb-2">
            <Calendar className="w-5 h-5" />
            <span className="text-lg font-semibold">
              {today
                ? new Date(today).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Loading...'}
            </span>
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="relative z-10 px-6 pb-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4 px-4">
            {dailyChallenge.levels.map((challenge, index) => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                index={index + 1}
                onClick={() => handleChallengeClick(challenge)}
                onViewResult={handleViewResult}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {dailyChallenge.isFullyCompleted && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-20">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-6 py-3 rounded-full shadow-lg">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              <span className="font-bold">
                All challenges completed! +{dailyChallenge.totalGems} Gems earned!
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Server Time Notice */}
      <Notice />
    </div>
  );
}
