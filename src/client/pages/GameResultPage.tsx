import { useState, useEffect } from 'react';
import { useRouter } from '@client/contexts/RouterContext';
import { GameResult } from '@shared/types/server';
import NavigationBar from '@client/components/basic/Navigation';
import { Trophy, Clock, Gem } from 'lucide-react';
import { userApi } from '@client/utils/api';

export default function GameResultPage() {
  const router = useRouter();
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGameResult = async () => {
      try {
        console.log('GameResultPage: Starting to fetch game result');
        const params = router.getParams();
        console.log('GameResultPage: Router params:', params);

        const challengeId = params.challengeId;
        const gameResultParam = params.gameResult;

        if (!challengeId) {
          console.error('GameResultPage: No challenge ID provided');
          setError('No challenge ID provided');
          setLoading(false);
          return;
        }

        console.log('GameResultPage: Challenge ID:', challengeId);
        console.log('GameResultPage: Game result param:', gameResultParam);

        let result: GameResult | null = null;

        // If gameResult is passed as parameter, use it directly
        if (gameResultParam) {
          try {
            console.log('GameResultPage: Parsing game result parameter');
            result = JSON.parse(gameResultParam);
            console.log('GameResultPage: Parsed result:', result);
          } catch (parseError) {
            console.warn('GameResultPage: Failed to parse gameResult parameter:', parseError);
          }
        }

        // If no gameResult parameter or parsing failed, fetch from server
        if (!result) {
          console.log('GameResultPage: Fetching from server with challengeId:', challengeId);
          // Try to get username from context or params
          const username = params.username || 'anonymous';
          result = await userApi.getGameResultByChallengeId(username, challengeId);
          console.log('GameResultPage: Server result:', result);
        }

        if (!result) {
          console.error('GameResultPage: No game result found');
          setError('Game result not found');
          setLoading(false);
          return;
        }

        console.log('GameResultPage: Setting game result:', result);
        setGameResult(result);
        setLoading(false);
      } catch (err) {
        console.error('GameResultPage: Error fetching game result:', err);
        setError('Failed to load game result');
        setLoading(false);
      }
    };

    void fetchGameResult();
  }, [router]);

  const handleBackToChallenges = () => {
    router.goto('daily-challenges');
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading result...</div>
      </div>
    );
  }

  if (error || !gameResult) {
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
                <h1 className="text-3xl font-bold text-white mb-2">{gameResult.themeName}</h1>
                <div className="flex items-center gap-4">
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(gameResult.difficulty)}`}
                  >
                    {gameResult.difficulty.toUpperCase()}
                  </div>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <span className="text-sm">{getDifficultyStars(gameResult.difficulty)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-400">
                    <Gem className="w-4 h-4" />
                    <span className="text-sm font-semibold">+{gameResult.gemsEarned} Gems</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-green-400 mb-1">{gameResult.score}</div>
                <div className="text-gray-400 text-sm">Final Score</div>
              </div>
            </div>

            {/* Game Info */}
            <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Game Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-400 text-sm">Theme:</span>
                  <p className="text-white font-medium">{gameResult.themeName}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Difficulty:</span>
                  <p className="text-white font-medium capitalize">{gameResult.difficulty}</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Time Spent:</span>
                  <p className="text-white font-medium">{gameResult.timeSpent} seconds</p>
                </div>
                <div>
                  <span className="text-gray-400 text-sm">Hints Used:</span>
                  <p className="text-white font-medium">{gameResult.hintsUsed}</p>
                </div>
              </div>
            </div>

            {/* Completion Info */}
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Clock className="w-4 h-4" />
              <span>Completed on {formatDate(gameResult.completedAt)}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Score Card */}
            <div className="bg-black/80 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <h3 className="text-lg font-semibold text-white">Score</h3>
              </div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">{gameResult.score}</div>
              <div className="text-gray-400 text-sm">Points earned</div>
            </div>

            {/* Time Card */}
            <div className="bg-black/80 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-6 h-6 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Time</h3>
              </div>
              <div className="text-3xl font-bold text-blue-400 mb-2">{gameResult.timeSpent}s</div>
              <div className="text-gray-400 text-sm">Time spent</div>
            </div>

            {/* Gems Card */}
            <div className="bg-black/60 backdrop-blur-sm rounded-xl border border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-4">
                <Gem className="w-6 h-6 text-green-400" />
                <h3 className="text-lg font-semibold text-white">Gems</h3>
              </div>
              <div className="text-3xl font-bold text-green-400 mb-2">+{gameResult.gemsEarned}</div>
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
