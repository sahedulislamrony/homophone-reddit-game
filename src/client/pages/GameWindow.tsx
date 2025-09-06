import React, { useState } from 'react';
import { useRouter } from '@client/contexts/RouterContext';
import { Home, Lightbulb, CheckCircle, XCircle } from 'lucide-react';
import { GameObject, GameState, GameFeedback } from '@shared/types/game';

// Sample game object - in a real app, this would come from props or API
const gameObject: GameObject = {
  themeName: 'Harry Potter',
  content: 'Hary was a grate wizard who new many spells. He road a broom threw the castle halls.',
  correctWords: ['Harry', 'great', 'knew', 'rode', 'through'],
  themeBgImage: 'placeholder',
};

export default function GameWindow() {
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
      <div className="w-full min-h-screen dark-gradient flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-accent mb-4">Game Complete!</h1>
          <p className="text-xl text-foreground mb-8">Final Score: {gameState.score}</p>
          <button
            onClick={() => router.goto('home')}
            className="px-8 py-4 bg-accent text-accent-foreground rounded-xl hover:bg-accent/90 transition-all duration-300"
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
            isIncorrect ? 'text-error font-semibold underline decoration-error' : 'text-gray-100'
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
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Close/Home Button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => router.goto('home')}
          className="p-3 bg-card/80 backdrop-blur-sm border border-border rounded-xl hover:bg-card transition-all duration-300 glow-hover"
        >
          <Home className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between p-6">
        <div className="text-accent font-semibold text-lg">Theme: {gameObject.themeName}</div>
        <div className="flex items-center gap-4">
          <div className="text-foreground">
            Score: <span className="text-accent font-bold">{gameState.score}</span>
          </div>
          <button
            onClick={handleHint}
            disabled={showHint}
            className="p-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-all duration-300 glow-hover disabled:opacity-50"
          >
            <Lightbulb className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 pb-6">
        <div className="max-w-4xl mx-auto">
          {/* Game Card */}
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-8 mb-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Find the Homophone</h2>
              <div className="text-lg text-gray-100 leading-relaxed">{renderContent()}</div>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>
                  Word {gameState.currentWordIndex + 1} of {gameObject.correctWords.length}
                </span>
                <span>Hints used: {gameState.hintsUsed}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(gameState.currentWordIndex / gameObject.correctWords.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Input Section */}
            {!gameState.isCompleted && (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter the correct word..."
                    className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  />
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-all duration-300 accent-hover font-semibold"
                  >
                    Submit
                  </button>
                </div>

                {/* Hint Display */}
                {showHint && (
                  <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                    <p className="text-primary text-sm">
                      <strong>Hint:</strong> The correct word starts with "{currentWord[0]}" and has{' '}
                      {currentWord.length} letters.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Completion Screen */}
            {gameState.isCompleted && (
              <div className="text-center space-y-6">
                <div className="text-4xl font-bold text-accent mb-4">🎉 Congratulations! 🎉</div>
                <div className="text-xl text-foreground mb-2">
                  Final Score: <span className="text-accent font-bold">{gameState.score}</span>
                </div>
                <div className="text-muted-foreground mb-6">
                  You found all {gameObject.correctWords.length} homophones!
                </div>
                <button
                  onClick={handleNextGame}
                  className="px-8 py-4 bg-accent text-accent-foreground rounded-xl hover:bg-accent/90 transition-all duration-300 accent-hover font-semibold text-lg"
                >
                  Play Again
                </button>
              </div>
            )}
          </div>

          {/* Feedback Messages */}
          {feedback && (
            <div
              className={`p-4 rounded-xl border-2 mb-6 ${
                feedback.type === 'correct'
                  ? 'bg-success/10 border-success text-success'
                  : feedback.type === 'wrong'
                    ? 'bg-error/10 border-error text-error'
                    : 'bg-warning/10 border-warning text-warning'
              }`}
            >
              <div className="flex items-center gap-3">
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
  );
}
