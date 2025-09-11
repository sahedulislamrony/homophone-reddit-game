import { useState, useEffect } from 'react';
import { useRouter } from '@client/contexts/RouterContext';
import { useUserContext } from '@client/contexts/UserContext';
import { ChallengeLevel, DailyChallenge } from '@shared/types/challenge';
import NavigationBar from '@client/components/basic/Navigation';
import ChallengeCard from '@client/game/components/ChallengeCard';
import { Gem, Calendar, Trophy } from 'lucide-react';
import { userApi } from '@client/utils/api';

export default function DailyChallengePage() {
  const router = useRouter();
  const { username } = useUserContext();
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null);
  const [userProgress, setUserProgress] = useState<{ totalGems: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDailyChallenges = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!username || username === 'anonymous') {
          setError('User not logged in');
          setLoading(false);
          return;
        }

        // Fetch today's games from server
        const todayGames = await userApi.getTodayGames(username);

        // Create daily challenges - these should be NEW challenges, not completed games
        // For now, create 3 new challenges that haven't been completed
        const challengeLevels: ChallengeLevel[] = [
          {
            id: `daily-challenge-1-${new Date().toISOString().split('T')[0]}`,
            themeName: 'Harry Potter',
            content: 'Find the homophones in this magical world!',
            correctWords: ['witch', 'which', 'wand', 'wound'],
            themeBgImage: '/images/harrypotter_bg.jpg',
            hints: ['Think about magical creatures', 'Consider spell components'],
            difficulty: 'easy',
            gemReward: 10,
            isLocked: false,
            isCompleted: false, // New challenges are not completed
            completedAt: '',
            score: 0,
          },
          {
            id: `daily-challenge-2-${new Date().toISOString().split('T')[0]}`,
            themeName: 'Space Adventure',
            content: 'Navigate through space with homophones!',
            correctWords: ['mars', 'mars', 'star', 'stare'],
            themeBgImage: '/images/space_bg.jpg',
            hints: ['Look to the stars', 'Consider planetary names'],
            difficulty: 'medium',
            gemReward: 15,
            isLocked: false,
            isCompleted: false, // New challenges are not completed
            completedAt: '',
            score: 0,
          },
          {
            id: `daily-challenge-3-${new Date().toISOString().split('T')[0]}`,
            themeName: 'Ocean Depths',
            content: 'Dive deep and find the homophones!',
            correctWords: ['sea', 'see', 'wave', 'waive'],
            themeBgImage: '/images/ocean_bg.jpg',
            hints: ['Think about the ocean', 'Consider water-related words'],
            difficulty: 'hard',
            gemReward: 20,
            isLocked: false,
            isCompleted: false, // New challenges are not completed
            completedAt: '',
            score: 0,
          },
        ];

        // Check which challenges have been completed by comparing with server data
        const completedChallengeIds = new Set(todayGames.map((game) => game.challengeId));
        const updatedChallengeLevels = challengeLevels.map((challenge) => {
          const isCompleted = completedChallengeIds.has(challenge.id);
          const completedGame = todayGames.find((game) => game.challengeId === challenge.id);

          return {
            ...challenge,
            isCompleted,
            completedAt: completedGame?.completedAt || '',
            score: completedGame?.score || 0,
          };
        });

        const dailyChallenge: DailyChallenge = {
          date: new Date().toISOString().split('T')[0]!,
          levels: updatedChallengeLevels,
          totalGems: updatedChallengeLevels.reduce((sum, level) => sum + (level.gemReward || 0), 0),
          completedLevels: updatedChallengeLevels.filter((level) => level.isCompleted).length,
          isFullyCompleted: updatedChallengeLevels.every((level) => level.isCompleted),
        };

        setDailyChallenge(dailyChallenge);

        // Set user progress (simplified)
        setUserProgress({
          totalGems: updatedChallengeLevels.reduce((sum, level) => sum + (level.gemReward || 0), 0),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch daily challenges');
        console.error('Error fetching daily challenges:', err);
      } finally {
        setLoading(false);
      }
    };

    void fetchDailyChallenges();
  }, [username]);

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

  const handleViewResult = (challengeId: string) => {
    console.log('DailyChallengePage: Navigating to result for challenge:', challengeId);
    router.goto('game-result', { challengeId });
  };

  const handleBackToHome = () => {
    router.goto('home');
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading challenges...</div>
      </div>
    );
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

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Header */}
      <div className="relative z-10 p-6">
        <NavigationBar title="Daily Challenges" onBack={handleBackToHome} />

        {/* Date and Stats */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-white mb-2">
            <Calendar className="w-5 h-5" />
            <span className="text-lg font-semibold">{today}</span>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-300">
            <div className="flex items-center gap-1">
              <Gem className="w-4 h-4 text-yellow-400" />
              <span>{userProgress?.totalGems || 0} Gems</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-orange-400" />
              <span>
                {dailyChallenge.completedLevels}/{dailyChallenge.levels.length} Complete
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="relative z-10 px-6 pb-6">
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
    </div>
  );
}
