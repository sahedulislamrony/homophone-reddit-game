type GameHeaderProps = {
  themeName: string;
  onBack: () => void;
};

export default function GameHeader({ themeName, onBack }: GameHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={onBack}
        className="p-2 bg-gray-800/50 text-white rounded-lg hover:bg-gray-700/50 transition-all duration-300"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <h1 className="text-2xl font-bold text-white">{themeName}</h1>
      <div className="w-9" /> {/* Spacer for centering */}
    </div>
  );
}
