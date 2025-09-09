import { useState, useEffect } from 'react';
import { useRouter } from '@client/contexts/RouterContext';
import { DailyChallengeManager } from '@client/game/data/DailyChallengeManager';
import { ChallengeLevel } from '@shared/types/challenge';
import NavigationBar from '@client/components/basic/Navigation';
import { Trophy, Clock, Target, Gem, ArrowLeft, Play } from 'lucide-react';

export default function GameResultPage() {
  const router = useRouter();
  const [challenge, setChallenge] = useState<ChallengeLevel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = router.getParams();
    const challengeId = params.challengeId;

    if (!challengeId) {
      setError('No challenge ID provided');
      setLoading(false);
      return;
    }

    const challengeManager = DailyChallengeManager.getInstance();
    const challenges = challengeManager.getTodaysChallenges();
    const foundChallenge = challenges.levels.find((level) => level.id === challengeId);

    if (!foundChallenge) {
      setError('Challenge not found');
      setLoading(false);
      return;
    }

    if (!foundChallenge.isCompleted) {
      setError('Challenge not completed yet');
      setLoading(false);
      return;
    }

    setChallenge(foundChallenge);
    setLoading(false);
  }, [router]);

  const handleBackToChallenges = () => {
    router.goto('daily-challenges');
  };

  const handleReplayChallenge = () => {
    if (challenge) {
      router.goto('game', { challengeId: challenge.id });
    }
  };

  const handleBackToHome = () => {
    router.goto('home');
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading result...</div>
      </div>
    );
  }

  if (error || !challenge) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error</div>
          <div className="text-white mb-6">{error}</div>
          <button
            onClick={handleBackToChallenges}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition-colors"
          >
            Back to Challenges
          </button>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400 bg-green-400/20';
      case 'medium':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'hard':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getDifficultyStars = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '⭐';
      case 'medium':
        return '⭐⭐';
      case 'hard':
        return '⭐⭐⭐';
      default:
        return '⭐';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full min-h-screen bg-black">
      {/* Header */}
      <div className="relative z-10 p-6">
        <NavigationBar title="Game Result" onBack={handleBackToChallenges} />
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 pb-6">
        <div className="max-w-4xl mx-auto">
          {/* Challenge Header */}
          <div className="bg-black/60 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 mb-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{challenge.themeName}</h1>
                <div className="flex items-center gap-4">
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(challenge.difficulty)}`}
                  >
                    {challenge.difficulty.toUpperCase()}
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <span className="text-sm">{getDifficultyStars(challenge.difficulty)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-400">
                    <Gem className="w-4 h-4" />
                    <span className="text-sm font-semibold">+{challenge.gemReward} Gems</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-green-400 mb-1">{challenge.score || 0}</div>
                <div className="text-gray-400 text-sm">Final Score</div>
              </div>
            </div>

            {/* Challenge Content */}
            <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Challenge Content</h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">{challenge.content}</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-400">Correct words found:</span>
                {challenge.correctWords.map((word, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-sm font-medium"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </div>

            {/* Completion Info */}
            {challenge.completedAt && (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Clock className="w-4 h-4" />
                <span>Completed on {formatDate(challenge.completedAt)}</span>
              </div>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Score Card */}
            <div className="bg-black/80 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Score</h3>
              </div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">{challenge.score || 0}</div>
              <div className="text-gray-400 text-sm">Points earned</div>
            </div>

            {/* Difficulty Card */}
            <div className="bg-black/80 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Difficulty</h3>
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-2">
                {getDifficultyStars(challenge.difficulty)}
              </div>
              <div className="text-gray-400 text-sm capitalize">{challenge.difficulty} level</div>
            </div>

            {/* Gems Card */}
            <div className="bg-black/60 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Gem className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Gems</h3>
              </div>
              <div className="text-3xl font-bold text-green-400 mb-2">+{challenge.gemReward}</div>
              <div className="text-gray-400 text-sm">Gems earned</div>
            </div>
          </div>

          {/* Action Buttons */}
          {/* <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleReplayChallenge}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-500 text-white rounded-xl hover:bg-blue-400 transition-all duration-300 font-semibold"
            >
              <Play className="w-5 h-5" />
              Replay Challenge
            </button>
            <button
              onClick={handleBackToChallenges}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-600 text-white rounded-xl hover:bg-gray-500 transition-all duration-300 font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Challenges
            </button>
            <button
              onClick={handleBackToHome}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-700 text-white rounded-xl hover:bg-gray-600 transition-all duration-300 font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
