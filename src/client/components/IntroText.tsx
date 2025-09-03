export const IntroText = () => {
  return (
    <div className="flex flex-col items-center gap-5 animate-fade-in-up-delay-1 max-w-2xl mx-auto text-center">
      {/* Main heading with improved gradient */}
      <h1 className="text-5xl md:text-6xl font-bold leading-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
          Level Up Your
        </span>
        <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-500">
          Focus
        </span>
      </h1>

      {/* Subheading with better spacing */}
      <div className="h-px w-24 bg-gradient-to-r from-transparent via-blue-500 to-transparent my-2"></div>

      {/* Simplified tagline */}
      <div className="flex gap-4 mt-3 text-sm font-semibold text-white/70">
        <span className="text-cyan-300">Precision</span>
        <span>•</span>
        <span className="text-blue-300">Speed</span>
        <span>•</span>
        <span className="text-emerald-300">Mastery</span>
      </div>
    </div>
  );
};
