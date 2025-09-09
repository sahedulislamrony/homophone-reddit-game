type GameCompleteProps = {
  finalScore: number;
  onBackToHome: () => void;
};

export default function GameComplete({ finalScore, onBackToHome }: GameCompleteProps) {
  return (
    <div className="w-full min-h-screen bg-black flex items-center justify-center p-6">
      <div className="text-center max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">Game Complete!</h1>
        <p className="text-xl text-white mb-8">Final Score: {finalScore}</p>
        <button
          onClick={onBackToHome}
          className="px-8 py-4 bg-yellow-500 text-black rounded-xl hover:bg-yellow-400 transition-all duration-300 font-semibold"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
