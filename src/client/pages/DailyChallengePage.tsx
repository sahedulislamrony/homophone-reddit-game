import { useState, useEffect } from 'react';
import { useRouter } from '@client/contexts/RouterContext';
import { DailyChallengeManager } from '@client/game/data/DailyChallengeManager';
import { ChallengeLevel, DailyChallenge } from '@shared/types/challenge';
import NavigationBar from '@client/components/basic/Navigation';
import ChallengeCard from '@client/game/components/ChallengeCard';
import { Gem, Calendar, Trophy } from 'lucide-react';

export default function DailyChallengePage() {
  const router = useRouter();
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null);
  const [userProgress, setUserProgress] = useState<{ totalGems: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const challengeManager = DailyChallengeManager.getInstance();
    const challenges = challengeManager.getTodaysChallenges();
    const progress = challengeManager.getUserProgress();

    setDailyChallenge(challenges);
    setUserProgress(progress);
    setLoading(false);
  }, []);

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
