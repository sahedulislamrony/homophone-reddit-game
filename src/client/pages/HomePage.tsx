import { Pages } from '@/shared/types/router';
import { useRouter } from '@client/contexts/RouterContext';
import { Play, Trophy, HelpCircle, Home, BarChart } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const handleNavigation = (page: string) => {
    router.goto(page as Pages);
  };

  return (
    <div className="w-full min-h-screen dark-gradient relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-accent rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6">
        <div className="max-w-2xl mx-auto text-center text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
          {/* Title */}
          <h1 className="text-5xl font-bold text-accent mb-4 neon-glow">Welcome to</h1>
          <h1 className="text-5xl font-bold text-accent mb-4 neon-glow">Daily Homophone Hunt</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Find the wrong words and replace them with correct homophones!
          </p>

          {/* Action Buttons */}
          <div className="space-y-6">
            {/* Start Game Button */}
            <button
              onClick={() => handleNavigation('game')}
              className="group w-full max-w-md mx-auto p-6 bg-accent text-accent-foreground rounded-2xl border-2 border-accent hover:bg-accent/90 transition-all duration-300 accent-glow accent-hover"
            >
              <div className="flex items-center justify-center gap-4">
                <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-xl font-semibold">Start Game</span>
              </div>
            </button>

            <button
              onClick={() => handleNavigation('stats')}
              className="group w-full max-w-md mx-auto p-6 bg-accent text-accent-foreground rounded-2xl border-2 border-accent hover:bg-accent/90 transition-all duration-300 accent-glow accent-hover"
            >
              <div className="flex items-center justify-center gap-4">
                <BarChart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-xl font-semibold">See Your Stats</span>
              </div>
            </button>

            {/* Secondary Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
              <button
                onClick={() => handleNavigation('leaderboard')}
                className="group p-4 bg-card/60 backdrop-blur-sm border border-border rounded-xl hover:bg-card/80 transition-all duration-300 glow-hover"
              >
                <div className="flex items-center justify-center gap-3">
                  <Trophy className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-foreground">Leaderboard</span>
                </div>
              </button>

              <button
                onClick={() => handleNavigation('how-to-play')}
                className="group p-4 bg-card/60 backdrop-blur-sm border border-border rounded-xl hover:bg-card/80 transition-all duration-300 glow-hover"
              >
                <div className="flex items-center justify-center gap-3">
                  <HelpCircle className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-foreground">How to Play</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
