import { Gem, Trophy } from 'lucide-react';

type GameCompleteProps = {
  finalScore: number;
  onBackToHome: () => void;
  onBackToChallenges?: () => void;
  onViewResult?: () => void;
  isChallenge?: boolean;
  gemsEarned?: number;
};

export default function GameComplete({
  finalScore,
  onBackToHome,
  onBackToChallenges,
  onViewResult,
  isChallenge = false,
  gemsEarned = 0,
}: GameCompleteProps) {
  return (
    <div className="w-full min-h-screen bg-black flex items-center justify-center p-6">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-6">
          {isChallenge ? (
            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          ) : (
            <div className="w-16 h-16 bg-yellow-400 rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
          )}
        </div>

        <h1 className="text-4xl font-bold text-yellow-400 mb-4">
          {isChallenge ? 'Challenge Complete!' : 'Game Complete!'}
        </h1>

        <div className="space-y-3 mb-8">
          <p className="text-xl text-white">Final Score: {finalScore}</p>
          {isChallenge && gemsEarned > 0 && (
            <div className="flex items-center justify-center gap-2 text-green-400">
              <Gem className="w-5 h-5" />
              <span className="text-lg font-semibold">+{gemsEarned} Gems earned!</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {isChallenge && onViewResult && (
            <button
              onClick={onViewResult}
              className="w-full px-8 py-4 bg-green-500 text-white rounded-xl hover:bg-green-400 transition-all duration-300 font-semibold"
            >
              View Result
            </button>
          )}
          {isChallenge && onBackToChallenges && (
            <button
              onClick={onBackToChallenges}
              className="w-full px-8 py-4 bg-sky-500 text-white rounded-xl hover:bg-sky-400 transition-all duration-300 font-semibold"
            >
              Back to Challenges
            </button>
          )}
          <button
            onClick={onBackToHome}
            className="w-full px-8 py-4 bg-yellow-500 text-black rounded-xl hover:bg-yellow-400 transition-all duration-300 font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
