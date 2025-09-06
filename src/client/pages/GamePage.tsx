import { useRouter } from '../contexts/RouterContext';
import { ArrowLeft, Clock } from 'lucide-react';
import { useLoading } from '@client/components/Loader';

export default function GamePage() {
  const router = useRouter();
  const { startLoading } = useLoading();

  const handleDifficultySelect = async (difficulty: string) => {
    await startLoading(1000);
    console.log(`${difficulty} selected`);
    // Here you would typically start the game
  };

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Modern Header */}
      <header className="w-full border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.goto('home')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <h1 className="text-xl font-semibold text-foreground">Training Mode</h1>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Description */}
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold text-foreground mb-3">
              Select Your Training Level
            </h2>
            <p className="text-muted-foreground">
              Choose the difficulty that matches your current attention training level
            </p>
          </div>

          {/* Difficulty Options */}
          <div className="space-y-6">
            <DifficultyOption
              level="Beginner"
              description="Perfect for starting your attention training journey"
              duration="5 minutes"
              features={['Simple exercises', 'Gentle pace', 'Basic patterns']}
              color="green"
              onClick={() => handleDifficultySelect('beginner')}
            />

            <DifficultyOption
              level="Intermediate"
              description="For those with some experience in focus training"
              duration="10 minutes"
              features={['Complex patterns', 'Moderate speed', 'Multi-tasking']}
              color="blue"
              onClick={() => handleDifficultySelect('intermediate')}
            />

            <DifficultyOption
              level="Advanced"
              description="Challenge yourself with expert-level attention exercises"
              duration="15 minutes"
              features={['Rapid sequences', 'High complexity', 'Endurance focus']}
              color="purple"
              onClick={() => handleDifficultySelect('advanced')}
            />
          </div>

          {/* Quick Stats */}
          <div className="mt-12 p-6 bg-muted rounded-xl">
            <h3 className="text-lg font-semibold text-foreground mb-4">Training Overview</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-semibold text-foreground">0</div>
                <div className="text-sm text-muted-foreground">Sessions</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-foreground">0</div>
                <div className="text-sm text-muted-foreground">Best Score</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-foreground">0</div>
                <div className="text-sm text-muted-foreground">Streak</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function DifficultyOption({
  level,
  description,
  duration,
  features,
  color,
  onClick,
}: {
  level: string;
  description: string;
  duration: string;
  features: string[];
  color: 'green' | 'blue' | 'purple';
  onClick: () => void;
}) {
  const colorClasses = {
    green: 'border-green-200 bg-green-50 hover:bg-green-100',
    blue: 'border-blue-200 bg-blue-50 hover:bg-blue-100',
    purple: 'border-purple-200 bg-purple-50 hover:bg-purple-100',
  };

  const iconClasses = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
  };

  return (
    <button
      onClick={onClick}
      className={`w-full p-6 rounded-xl border-2 ${colorClasses[color]} transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 text-left`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground mb-2">{level}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>{duration}</span>
        </div>
      </div>

      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className={`w-1.5 h-1.5 rounded-full ${iconClasses[color]}`}></div>
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </button>
  );
}
