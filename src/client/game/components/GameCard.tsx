import React from 'react';
import { Lightbulb, Quote } from 'lucide-react';
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
  return (
    <div className="bg-black/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700 p-8 mb-6">
      {/* Score and Hint */}
      <div className="flex justify-between items-start mb-6 ">
        <div className="text-white">
          <div className="flex items-center gap-4">
            <div>
              Score: <span className="text-yellow-400 font-bold">{gameState.score}</span>
            </div>
            <div className="text-sm">
              Gems: <span className="text-blue-400 font-bold">{gameState.gems}</span>
            </div>
            {streakInfo && streakInfo.currentStreak > 0 && (
              <div className="text-sm">
                Streak: <span className="text-green-400 font-bold">{streakInfo.currentStreak}</span>
              </div>
            )}
          </div>
          {/* <div className="text-xs text-gray-400 mt-1">
            Free hints: {3 - gameState.freeHintsUsed} remaining
          </div> */}
        </div>
        <button
          onClick={onHint}
          disabled={!canUseHint}
          className="p-2 bg-black/80 border border-yellow-400 rounded-full hover:bg-black/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          title={canUseHint ? 'Use a hint' : 'No hints available'}
        >
          <Lightbulb className="size-5 text-yellow-400" />
        </button>
      </div>

      {/* Content */}
      <div className="text-center mb-8">
        <div className="text-lg text-gray-100 leading-relaxed mb-6 px-4 py-6 relative">
          <Quote className="size-10 text-gray-900 rotate-180 opacity-80 absolute top-0 left-0 z-10" />
          <div className="z-20">{content}</div>
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
