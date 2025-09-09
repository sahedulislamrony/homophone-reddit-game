import { Pages } from '@/shared/types/router';
import { useRouter } from '@client/contexts/RouterContext';
import { Play, Trophy, HelpCircle, BarChart, NotebookPen } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const handleNavigation = (page: string) => {
    router.goto(page as Pages);
  };

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/root_bg.png')" }}
    >
      {/* Dark overlay for better text readability */}
      <div className="w-full min-h-screen bg-black/70 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full mx-auto text-center">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-4">
            The Daily Homophone
          </h1>
          <div className="flex flex-col items-center gap-0 mb-5 mt-5 max-w-md mx-auto">
            <p className="text-lg text-gray-300 mb-0 text-center  ">
              Hunt down <span className="font-[800] text-rose-700">Impostor</span> words and claim
              your linguistic <span className="font-[800] text-yellow-600">Victory</span>
            </p>
            <NotebookPen className="size-6 text-yellow-400 mt-3" />
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Start Game Button */}
            <button
              onClick={() => handleNavigation('game')}
              className="group w-full max-w-sm mx-auto py-3 px-6 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
            >
              <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Start Daily Challenge</span>
            </button>

            <button
              onClick={() => handleNavigation('stats')}
              className="group w-full max-w-sm mx-auto py-3 px-6 bg-gray-900/80 backdrop-blur-md text-white rounded-full border border-gray-700 hover:bg-gray-800/80 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
            >
              <BarChart className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Your Stats</span>
            </button>

            {/* Secondary Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-sm mx-auto">
              <button
                onClick={() => handleNavigation('leaderboard')}
                className="group py-2.5 px-4 bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-full hover:bg-gray-800/60 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Trophy className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-200">Leaderboard</span>
              </button>

              <button
                onClick={() => handleNavigation('how-to-play')}
                className="group py-2.5 px-4 bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-full hover:bg-gray-800/60 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-gray-200">How to Play</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
