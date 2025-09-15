import { useState, useEffect } from 'react';
import { useRouter } from '@client/contexts/RouterContext';
import { GameResult } from '@shared/types/server';
import NavigationBar from '@client/components/basic/Navigation';
import { Clock, Gem, MessageCircle, Trophy, Zap, Target, Loader2 } from 'lucide-react';
import { userApi } from '@client/utils/api';
import { FullScreenLoader, SuccessPopup } from '@client/components';

export default function GameResultPage() {
  const router = useRouter();
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  useEffect(() => {
    const fetchGameResult = async () => {
      try {
        const params = router.getParams();
        const challengeId = params.challengeId;
        const gameResultParam = params.gameResult;

        if (!challengeId) {
          setError('No challenge ID provided');
          setLoading(false);
          return;
        }

        let result: GameResult | null = null;

        if (gameResultParam) {
          try {
            result = JSON.parse(gameResultParam);
          } catch (parseError) {
            console.warn('Failed to parse gameResult parameter:', parseError);
          }
        }

        if (!result) {
          const username = params.username || 'anonymous';
          result = await userApi.getGameResultByChallengeId(username, challengeId);
        }

        if (!result) {
          setError('Game result not found');
          setLoading(false);
          return;
        }

        setGameResult(result);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching game result:', err);
        setError('Failed to load game result');
        setLoading(false);
      }
    };

    void fetchGameResult();
  }, [router]);

  const handleBackToChallenges = () => {
    router.goto('daily-challenges');
  };

  const handleCommentResult = async () => {
    if (!gameResult || isCommenting) {
      return;
    }

    setIsCommenting(true);

    try {
      const response = await fetch('/api/comments/submit-game-result', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          gameResult: gameResult,
          username: gameResult.username,
        }),
      });

      const result = await response.json();

      if (result.status === 'success') {
        setShowSuccessPopup(true);
        // Update the game result to mark as commented
        if (gameResult) {
          setGameResult({ ...gameResult, isResultCommented: true });
          // Also update on the server
          await fetch(`/api/games/${gameResult.id}/comment-status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isCommented: true }),
          });
        }
      } else if (result.alreadyCommented) {
        // User has already commented, update the game result
        if (gameResult) {
          setGameResult({ ...gameResult, isResultCommented: true });
        }
      }
    } catch (error) {
      // Silent fail - could add error popup if needed
    } finally {
      setIsCommenting(false);
    }
  };

  if (loading) {
    return <FullScreenLoader isLoading={true} variant="game" message="Loading result" />;
  }

  if (error || !gameResult) {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
        <div className="text-center bg-black/40 backdrop-blur-lg rounded-2xl border border-yellow-500/30 p-8 max-w-md w-full">
          <div className="text-red-400 text-xl mb-4 font-semibold">Error</div>
          <div className="text-gray-300 mb-6">{error}</div>
          <button
            onClick={handleBackToChallenges}
            className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-semibold rounded-xl hover:from-yellow-500 hover:to-yellow-400 transition-all duration-300 transform hover:-translate-y-1 shadow-lg shadow-yellow-500/20"
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
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'hard':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="w-full min-h-screen bg-transparent text-white overflow-y-auto py-8 px-4">
      {/* Header */}
      <NavigationBar title="Game Results" onBack={handleBackToChallenges} />
      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-0 max-w-4xl">
        {/* Score Highlight */}
        <div className="flex flex-col items-center justify-center mb-10 mt-6">
          <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text text-transparent mb-2 drop-shadow-[0_0_20px_rgba(255,215,0,0.6)] animate-pulse">
            {gameResult.score.toLocaleString()}
          </div>
          <div className="text-gray-400 text-lg drop-shadow-[0_0_10px_rgba(156,163,175,0.3)]">
            Total Points
          </div>
          <div className="mt-2 flex items-center gap-2 bg-yellow-500/10 px-4 py-2 rounded-full border border-yellow-500/20 shadow-[0_0_15px_rgba(255,215,0,0.3)] backdrop-blur-sm">
            <Trophy className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" />
            <span className="text-yellow-400 font-medium drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]">
              Challenge Completed
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          {/* Theme Card */}
          <div className="bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-lg rounded-2xl border border-yellow-500/20 p-6 transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Theme</h3>
              <div className="p-2 bg-yellow-500/20 rounded-full">
                <Target className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-2xl font-bold text-white">{gameResult.themeName}</div>
              <div className="text-yellow-500/70 text-sm font-medium">Challenge</div>
            </div>
          </div>

          {/* Difficulty Card */}
          <div className="bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-lg rounded-2xl border border-yellow-500/20 p-6 transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Difficulty</h3>
              <div className="p-2 bg-yellow-500/20 rounded-full">
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${getDifficultyColor(gameResult.difficulty)}`}>
                  {gameResult.difficulty.charAt(0).toUpperCase() + gameResult.difficulty.slice(1)}
                </span>
              </div>
              <div className="text-yellow-500/70 text-sm font-medium">Level</div>
            </div>
          </div>

          {/* Gems Earned */}
          <div className="bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-lg rounded-2xl border border-yellow-500/20 p-6 transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Gems Earned</h3>
              <div className="p-2 bg-yellow-500/20 rounded-full">
                <Gem className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-4xl font-bold text-yellow-400">+{gameResult.gemsEarned}</div>
              <div className="text-yellow-500/70 text-sm font-medium">Reward</div>
            </div>
          </div>

          {/* Time Spent */}
          <div className="bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-lg rounded-2xl border border-yellow-500/20 p-6 transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Time Spent</h3>
              <div className="p-2 bg-yellow-500/20 rounded-full">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div className="text-4xl font-bold text-yellow-400">{gameResult.timeSpent}s</div>
              <div className="text-yellow-500/70 text-sm font-medium">Duration</div>
            </div>
          </div>
        </div>

        {/* Comment Button */}
        <div className="mb-10 mt-8">
          <button
            onClick={handleCommentResult}
            disabled={isCommenting || gameResult?.isResultCommented}
            className={`w-full flex items-center justify-center gap-3 px-8 py-4 font-bold rounded-xl transition-all duration-300 transform ${
              isCommenting
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed scale-95'
                : gameResult?.isResultCommented
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-yellow-600 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-400 hover:-translate-y-1 shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-500/40'
            }`}
          >
            {isCommenting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Posting Comment...
              </>
            ) : gameResult?.isResultCommented ? (
              <>
                <MessageCircle className="w-6 h-6" />
                Comment Posted ✓
              </>
            ) : (
              <>
                <MessageCircle className="w-6 h-6" />
                Comment Your Result
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Popup */}
      <SuccessPopup
        isVisible={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        title="Comment Posted!"
        message="Your game result has been successfully posted as a comment on this Reddit post."
      />
    </div>
  );
}
