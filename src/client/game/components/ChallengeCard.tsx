import { ChallengeLevel } from '@/shared/types/challenge';
import { Lock, CheckCircle, Gem, Sparkles } from 'lucide-react';

type ChallengeCardProps = {
  challenge: ChallengeLevel;
  index: number;
  onClick: () => void;
  onViewResult?: (challengeId: string) => void;
};

export default function ChallengeCard({
  challenge,
  index,
  onClick,
  onViewResult,
}: ChallengeCardProps) {
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

  const isClickable = !challenge.isLocked && !challenge.isCompleted;

  return (
    <div
      className={`relative w-full h-48 bg-black/60 backdrop-blur-sm rounded-xl border transition-all duration-300 ${
        challenge.isLocked
          ? 'border-gray-600 cursor-not-allowed opacity-60'
          : challenge.isCompleted
            ? 'border-green-400 cursor-pointer hover:border-green-300'
            : 'border-blue-400 cursor-pointer hover:border-blue-300 hover:scale-105'
      }`}
      onClick={isClickable ? onClick : undefined}
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 rounded-xl bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: challenge.themeBgImage.includes('placeholder')
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
            : `url(${challenge.themeBgImage})`,
        }}
      />

      {/* Lock Overlay */}
      {challenge.isLocked && (
        <div className="absolute inset-0 bg-black/70 rounded-xl flex items-center justify-center z-10">
          <div className="text-center">
            <Lock className="w-6 h-6 text-gray-400 mx-auto mb-1" />
            <p className="text-gray-400 text-xs">Complete previous</p>
          </div>
        </div>
      )}

      {/* Completion Overlay */}
      {challenge.isCompleted && (
        <div className="absolute inset-0 bg-green-500/20 rounded-xl flex items-center justify-center z-10">
          <div className="text-center">
            <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-1" />
            <p className="text-green-400 text-xs font-semibold">Completed</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-20 p-4 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-white font-bold text-sm">#{index}</span>
            <div
              className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(challenge.difficulty)}`}
            >
              {challenge.difficulty.toUpperCase()}
            </div>
          </div>
          <div className="flex items-center gap-1 text-yellow-400">
            <Gem className="w-3 h-3" />
            <span className="text-xs font-semibold">{challenge.gemReward}</span>
          </div>
        </div>

        {/* Theme Name */}
        <h3 className="text-white font-bold text-sm mb-2 line-clamp-2 flex-1">
          {challenge.themeName}
        </h3>

        {/* Difficulty Stars */}
        <div className="flex items-center gap-1 mb-3">
          <Sparkles className="w-3 h-3 text-yellow-400" />
          <span className="text-gray-400 text-xs ml-1">
            {challenge.correctWords.length} words to solve
          </span>
        </div>

        {/* Action Button */}
        <div className="mt-auto">
          {!challenge.isLocked && !challenge.isCompleted && (
            <button className="w-full bg-blue-500 hover:bg-blue-400 text-white font-semibold py-1.5 px-3 rounded-lg transition-all duration-300 text-xs">
              Start
            </button>
          )}

          {challenge.isCompleted && (
            <button
              onClick={() => onViewResult?.(challenge.id)}
              className="w-full bg-green-500 hover:bg-green-400 text-white font-semibold py-1.5 px-3 rounded-lg transition-all duration-300 text-xs"
            >
              View Results
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
