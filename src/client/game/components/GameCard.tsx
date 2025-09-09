import React from 'react';
import { Quote } from 'lucide-react';
import { GameState, GameFeedback } from '@shared/types/game';

type GameCardProps = {
  gameState: GameState;
  content: string;
  correctWords: string[];
  userInput: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onHint: () => boolean;
  canUseHint: boolean;
  feedback: GameFeedback | null;
  streakInfo?: {
    currentStreak: number;
    nextMultiplier: number;
    basePoints: number;
    nextPoints: number;
  };
};

export default function GameCard({
  gameState,
  content,
  correctWords,
  userInput,
  onInputChange,
  onSubmit,
  onKeyPress,
  onHint,
  canUseHint,
  streakInfo,
}: GameCardProps) {
  // Highlight incorrect words in the content
  const renderContent = () => {
    const words = content.split(' ');
    return words.map((word, index) => {
      const isIncorrect = correctWords.some((correctWord) =>
        word.toLowerCase().includes(correctWord.toLowerCase().slice(0, 3))
      );
      return (
        <span
          key={index}
          className={
            isIncorrect
              ? 'text-red-400 font-semibold underline decoration-red-400'
              : 'text-gray-100'
          }
        >
          {word}{' '}
        </span>
      );
    });
  };

  return (
    <div className="bg-black/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700 p-8 mb-6">
      {/* Score and Hint */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-white">
          <div className="flex items-center gap-4">
            <div>
              Score: <span className="text-yellow-400 font-bold">{gameState.score}</span>
            </div>
            {streakInfo && streakInfo.currentStreak > 0 && (
              <div className="text-sm">
                Streak: <span className="text-green-400 font-bold">{streakInfo.currentStreak}</span>
              </div>
            )}
          </div>
          {streakInfo && (
            <div className="text-xs text-gray-400 mt-1">
              Next correct: {streakInfo.nextPoints} points ({streakInfo.nextMultiplier}x)
            </div>
          )}
        </div>
        <button
          onClick={onHint}
          disabled={!canUseHint}
          className="p-2 bg-yellow-400/20 text-yellow-400 rounded-lg hover:bg-yellow-400/30 transition-all duration-300 disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="text-center mb-8">
        <div className="text-lg text-gray-100 leading-relaxed mb-6 px-4 py-6 relative">
          <Quote className="size-10 text-gray-900 rotate-180 opacity-80 absolute top-0 left-0 z-10" />
          <div className="z-20">{renderContent()}</div>
          <Quote className="size-10 text-gray-900 opacity-80 absolute -bottom-3 right-0 z-10" />
        </div>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>
            Words found: {gameState.userAnswers.length} of {correctWords.length}
          </span>
          <span>Hints used: {gameState.hintsUsed}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
            style={{
              width: `${(gameState.userAnswers.length / correctWords.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border border-gray-700 rounded-full p-1 transition-all duration-300 focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/20">
          <input
            type="text"
            value={userInput}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Enter the correct word..."
            className="flex-1 w-full px-4 py-3 bg-black/80 text-white rounded-full border-0 focus:outline-none focus:ring-0 transition-all duration-300"
          />
          <button
            onClick={onSubmit}
            className="px-6 py-3 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 transition-all duration-300 font-semibold min-w-[120px]"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
