import React, { useState } from 'react';
import { useRouter } from '@client/contexts/RouterContext';
import { Lightbulb, CheckCircle, XCircle, Quote } from 'lucide-react';
import { GameObject, GameState, GameFeedback } from '@shared/types/game';
import NavigationBar from '@client/components/basic/Navigation';

// Sample game object - in a real app, this would come from props or API
const gameObject: GameObject = {
  themeName: 'Harry Potter',
  content: 'Hary was a grate wizard who new many spells. He road a broom threw the castle halls.',
  correctWords: ['Harry', 'great', 'knew', 'rode', 'through'],
  themeBgImage: 'placeholder',
};

export default function GamePage() {
  const router = useRouter();
  const [gameState, setGameState] = useState<GameState>({
    currentWordIndex: 0,
    userAnswers: [],
    score: 0,
    hintsUsed: 0,
    isCompleted: false,
  });
  const [userInput, setUserInput] = useState('');
  const [feedback, setFeedback] = useState<GameFeedback | null>(null);
  const [showHint, setShowHint] = useState(false);

  const currentWord = gameObject.correctWords[gameState.currentWordIndex];
  const isLastWord = gameState.currentWordIndex === gameObject.correctWords.length - 1;

  // Early return if game is completed or no current word
  if (gameState.isCompleted || !currentWord) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center p-6">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-yellow-400 mb-4">Game Complete!</h1>
          <p className="text-xl text-white mb-8">Final Score: {gameState.score}</p>
          <button
            onClick={() => router.goto('home')}
            className="px-8 py-4 bg-yellow-500 text-black rounded-xl hover:bg-yellow-400 transition-all duration-300 font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!userInput.trim()) return;

    const isCorrect = userInput.toLowerCase() === currentWord.toLowerCase();
    const points = isCorrect ? 10 : 0;

    setFeedback({
      type: isCorrect ? 'correct' : 'wrong',
      message: isCorrect
        ? `Correct! You earned ${points} points.`
        : 'Wrong! Try again or use a hint.',
      ...(isCorrect && { points }),
    });

    if (isCorrect) {
      setGameState((prev) => ({
        ...prev,
        userAnswers: [...prev.userAnswers, userInput],
        score: prev.score + points,
        currentWordIndex: prev.currentWordIndex + 1,
        isCompleted: isLastWord,
      }));
      setUserInput('');
      setShowHint(false);
    }
  };

  const handleHint = () => {
    setShowHint(true);
    setGameState((prev) => ({
      ...prev,
      hintsUsed: prev.hintsUsed + 1,
    }));
    setFeedback({
      type: 'hint',
      message: `Hint: The correct word starts with "${currentWord[0]}" and has ${currentWord.length} letters.`,
    });
  };

  const handleNextGame = () => {
    // Reset game state for new game
    setGameState({
      currentWordIndex: 0,
      userAnswers: [],
      score: 0,
      hintsUsed: 0,
      isCompleted: false,
    });
    setUserInput('');
    setFeedback(null);
    setShowHint(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Highlight incorrect words in the content
  const renderContent = () => {
    const words = gameObject.content.split(' ');
    return words.map((word, index) => {
      const isIncorrect = gameObject.correctWords.some((correctWord) =>
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
    <div
      className="w-full min-h-screen relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${gameObject.themeBgImage})`,
        background: gameObject.themeBgImage.includes('placeholder')
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
          : `url(${gameObject.themeBgImage})`,
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/90"></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col p-6">
        <NavigationBar title={gameObject.themeName} onBack={() => router.goto('home')} />

        <div className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-white mb-6">
            Find The <span className="text-yellow-400 font-[800]">Homophone</span>
          </h2>
          <div className="max-w-2xl w-full mx-auto text-center">
            {/* Game Card */}
            <div className="bg-black/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700 p-8 mb-6">
              {/* Score and Hint */}
              <div className="flex justify-between items-center mb-6">
                <div className="text-white">
                  Score: <span className="text-yellow-400 font-bold">{gameState.score}</span>
                </div>
                <button
                  onClick={handleHint}
                  disabled={showHint}
                  className="p-2 bg-yellow-400/20 text-yellow-400 rounded-lg hover:bg-yellow-400/30 transition-all duration-300 disabled:opacity-50"
                >
                  <Lightbulb className="w-5 h-5" />
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
                    Word {gameState.currentWordIndex} of {gameObject.correctWords.length}
                  </span>
                  <span>Hints used: {gameState.hintsUsed}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${(gameState.currentWordIndex / gameObject.correctWords.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Input Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border border-gray-700 rounded-full p-1 transition-all duration-300 focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/20">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter the correct word..."
                    className="flex-1 w-full px-4 py-3 bg-black/80 text-white rounded-full border-0 focus:outline-none focus:ring-0 transition-all duration-300"
                  />
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 transition-all duration-300 font-semibold min-w-[120px]"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>

            {/* Feedback Messages */}
            {feedback && (
              <div
                className={`p-4 rounded-xl border-2 mb-6 ${
                  feedback.type === 'correct'
                    ? 'bg-green-400/10 border-green-400 text-green-400'
                    : feedback.type === 'wrong'
                      ? 'bg-red-400/10 border-red-400 text-red-400'
                      : 'bg-yellow-400/10 border-yellow-400 text-yellow-400'
                }`}
              >
                <div className="flex items-center gap-3 justify-center">
                  {feedback.type === 'correct' ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : feedback.type === 'wrong' ? (
                    <XCircle className="w-5 h-5" />
                  ) : (
                    <Lightbulb className="w-5 h-5" />
                  )}
                  <span className="font-medium">{feedback.message}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
