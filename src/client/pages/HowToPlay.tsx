import { useRouter } from '@client/contexts/RouterContext';
import { ArrowLeft, HelpCircle, Play, Trophy, Zap, Lightbulb, Clock, Target } from 'lucide-react';
import { useLoading } from '@client/components/Loader';

export default function HowToPlayPage() {
  const router = useRouter();
  const { startLoading } = useLoading();

  const handleBack = async () => {
    await startLoading(500);
    router.goto('home');
  };

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Modern Header */}
      <header className="w-full border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <h1 className="text-xl font-semibold text-foreground flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              How to Play
            </h1>
            <div className="w-16"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Introduction */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-foreground mb-4">Master Your Attention</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Learn how to improve your focus and concentration through scientifically designed
              attention training exercises
            </p>
          </div>

          {/* Training Levels */}
          <div className="space-y-8 mb-12">
            <TrainingLevel
              level="Beginner"
              color="green"
              icon={Play}
              duration="5 minutes"
              description="Perfect for starting your attention training journey"
              features={[
                'Simple visual exercises',
                'Gentle pace with clear instructions',
                'Basic pattern recognition',
                'Immediate feedback and encouragement',
              ]}
            />

            <TrainingLevel
              level="Intermediate"
              color="blue"
              icon={Trophy}
              duration="10 minutes"
              description="For those with some experience in focus training"
              features={[
                'Complex multi-step exercises',
                'Moderate speed challenges',
                'Multi-tasking components',
                'Progress tracking and analytics',
              ]}
            />

            <TrainingLevel
              level="Advanced"
              color="purple"
              icon={Zap}
              duration="15 minutes"
              description="Challenge yourself with expert-level attention exercises"
              features={[
                'Rapid sequence processing',
                'High complexity patterns',
                'Endurance focus training',
                'Advanced performance metrics',
              ]}
            />
          </div>

          {/* Tips and Strategies */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Lightbulb className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Pro Tips</h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                  <span>Practice daily for best results - even 5 minutes helps</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                  <span>Find a quiet environment to minimize distractions</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                  <span>Take breaks between sessions to maintain focus quality</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2"></div>
                  <span>Track your progress to stay motivated</span>
                </li>
              </ul>
            </div>

            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Scoring System</h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Correct Response</span>
                  <span className="font-semibold text-foreground">+10 points</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Speed Bonus</span>
                  <span className="font-semibold text-foreground">+1-5 points</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Streak Multiplier</span>
                  <span className="font-semibold text-foreground">x1.5-3.0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Perfect Session</span>
                  <span className="font-semibold text-foreground">+100 bonus</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function TrainingLevel({
  level,
  color,
  icon: Icon,
  duration,
  description,
  features,
}: {
  level: string;
  color: 'green' | 'blue' | 'purple';
  icon: any;
  duration: string;
  description: string;
  features: string[];
}) {
  const colorClasses = {
    green: 'border-green-200 bg-green-50',
    blue: 'border-blue-200 bg-blue-50',
    purple: 'border-purple-200 bg-purple-50',
  };

  const iconClasses = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
  };

  return (
    <div className={`rounded-xl border-2 p-6 ${colorClasses[color]}`}>
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className={`w-6 h-6 ${iconClasses[color]}`} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-semibold text-foreground">{level} Level</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
          </div>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className={`w-1.5 h-1.5 rounded-full ${iconClasses[color]}`}></div>
            <span>{feature}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
