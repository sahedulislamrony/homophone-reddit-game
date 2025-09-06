import { useRouter } from '@client/contexts/RouterContext';
import { Play, Trophy, HelpCircle, User, Settings, LucideIcon } from 'lucide-react';
import { useLoading } from '@client/components/Loader';

export default function HomePage() {
  const router = useRouter();
  const { startLoading } = useLoading();

  const handleNavigation = async (page: string) => {
    await startLoading(800);
    router.goto(page as any);
  };

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Modern Header */}
      <header className="w-full border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">M</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Minddit4u</h1>
                <p className="text-xs text-muted-foreground">Attention Training</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Guest User</span>
              </div>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Settings className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-3">Welcome to Minddit4u</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Enhance your focus and attention span with our scientifically designed training
              exercises
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <StatCard label="Sessions" value="0" />
              <StatCard label="Best Score" value="0" />
              <StatCard label="Streak" value="0" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <ModernButton
              text="Start Training"
              onClick={() => handleNavigation('game')}
              Icon={Play}
              variant="primary"
              description="Begin your attention training journey"
            />
            <div className="grid grid-cols-2 gap-4">
              <ModernButton
                text="Leaderboard"
                onClick={() => handleNavigation('leaderboard')}
                Icon={Trophy}
                variant="secondary"
                description="See top performers"
              />
              <ModernButton
                text="How to Play"
                onClick={() => handleNavigation('how-to-play')}
                Icon={HelpCircle}
                variant="secondary"
                description="Learn the rules"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="text-2xl font-semibold text-foreground mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function ModernButton({
  text,
  onClick,
  Icon,
  variant = 'secondary',
  description,
}: {
  text: string;
  onClick?: () => void;
  Icon: LucideIcon;
  variant?: 'primary' | 'secondary';
  description?: string;
}) {
  const baseClasses =
    'group relative w-full p-6 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantClasses =
    variant === 'primary'
      ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90 focus:ring-primary/50'
      : 'bg-card text-card-foreground border-border hover:bg-muted focus:ring-primary/50';

  return (
    <button className={`${baseClasses} ${variantClasses}`} onClick={onClick}>
      <div className="flex items-center gap-4">
        <div
          className={`p-3 rounded-lg ${variant === 'primary' ? 'bg-primary-foreground/20' : 'bg-muted'}`}
        >
          <Icon
            className={`w-5 h-5 ${variant === 'primary' ? 'text-primary-foreground' : 'text-muted-foreground'}`}
          />
        </div>
        <div className="text-left flex-1">
          <div className="font-semibold text-base mb-1">{text}</div>
          {description && (
            <div
              className={`text-sm ${variant === 'primary' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}
            >
              {description}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
