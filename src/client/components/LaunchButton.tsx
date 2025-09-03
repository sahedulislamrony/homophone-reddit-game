interface LaunchButtonProps {
  onClick: () => void;
}
export const LaunchButton = ({ onClick }: LaunchButtonProps) => {
  return (
    <div className="flex justify-center">
      <button
        className="relative bg-gradient-to-r from-purple-800 via-blue-800 to-cyan-800 text-white font-black text-xl 
                   px-20 py-5 rounded-xl transition-all duration-300
                   hover:scale-105 hover:brightness-110 active:scale-95
                   border border-cyan-400/50 shadow-2xl shadow-cyan-500/20
                   group-hover:shadow-cyan-500/40 group-hover:border-cyan-400
                   overflow-hidden"
        onClick={onClick}
      >
        START
      </button>
    </div>
  );
};
