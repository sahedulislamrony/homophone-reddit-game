export default function Notice() {
  return (
    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-6 max-w-md mx-auto">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-yellow-400 text-xs font-bold">!</span>
        </div>
        <p className="text-yellow-300/90 text-xs text-center">
          <strong>Note:</strong> Daily challenges and leaderboards use server time
        </p>
      </div>
    </div>
  );
}
