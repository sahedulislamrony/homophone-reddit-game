import { useRouter } from '@client/contexts/RouterContext';
import { Home, Play, Lightbulb, Target, Award, Clock, BarChart3 } from 'lucide-react';

export default function HowToPlayPage() {
  const router = useRouter();

  const handleStartGame = () => {
    router.goto('game');
  };

  return (
    <div className="w-full min-h-screen dark-gradient relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-accent rounded-full blur-3xl"></div>
      </div>

      {/* Navigation Buttons */}
      <div className="absolute top-6 right-6 z-10 flex gap-3">
        <button
          onClick={() => router.goto('stats')}
          className="p-3 bg-card/80 backdrop-blur-sm border border-border rounded-xl hover:bg-card transition-all duration-300 glow-hover"
        >
          <BarChart3 className="w-5 h-5 text-foreground" />
        </button>
        <button
          onClick={() => router.goto('home')}
          className="p-3 bg-card/80 backdrop-blur-sm border border-border rounded-xl hover:bg-card transition-all duration-300 glow-hover"
        >
          <Home className="w-5 h-5 text-foreground" />
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-accent neon-glow mb-4">How to Play</h1>
            <p className="text-lg text-muted-foreground">
              Master the art of homophones and become a word wizard!
            </p>
          </div>

          {/* Main Instructions Card */}
          <div className="bg-gray-900/85 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-8 mb-8">
            <div className="text-center mb-8">
              <Target className="w-16 h-16 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-4">The Objective</h2>
              <p className="text-lg text-gray-100 leading-relaxed">
                Find the wrong words in the given text and replace them with the correct homophones.
                <br />
                <span className="text-accent font-semibold">
                  Homophones are words that sound the same but have different meanings and
                  spellings.
                </span>
              </p>
            </div>

            {/* Example Section */}
            <div className="bg-card/40 backdrop-blur-sm rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-primary" />
                Example
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground mb-2">Given text:</p>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-border">
                    <p className="text-gray-100 text-lg">
                      "I went to the{' '}
                      <span className="text-error font-semibold underline decoration-error">
                        store
                      </span>{' '}
                      and{' '}
                      <span className="text-error font-semibold underline decoration-error">
                        board
                      </span>{' '}
                      a car."
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground mb-2">Corrected text:</p>
                  <div className="bg-success/10 border border-success/30 rounded-lg p-4">
                    <p className="text-gray-100 text-lg">
                      "I went to the <span className="text-success font-semibold">store</span> and{' '}
                      <span className="text-success font-semibold">bought</span> a car."
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <strong>Explanation:</strong> "board" should be "bought" - they sound similar but
                  have different meanings.
                </div>
              </div>
            </div>

            {/* Game Rules */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Play className="w-5 h-5 text-primary" />
                  How to Play
                </h3>
                <ul className="space-y-3 text-gray-100">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-accent/20 text-accent rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Read the themed text carefully</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-accent/20 text-accent rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span>Identify words that sound correct but are spelled wrong</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-accent/20 text-accent rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <span>Type the correct homophone in the input box</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-accent/20 text-accent rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      4
                    </span>
                    <span>Submit your answer and earn points</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Scoring
                </h3>
                <ul className="space-y-3 text-gray-100">
                  <li className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-success rounded-full"></div>
                    <span>
                      <strong>Correct answer:</strong> +10 points
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-error rounded-full"></div>
                    <span>
                      <strong>Wrong answer:</strong> 0 points
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-warning rounded-full"></div>
                    <span>
                      <strong>Using hints:</strong> No penalty
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                    <span>
                      <strong>Complete game:</strong> Bonus points
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-gray-900/85 backdrop-blur-sm rounded-2xl shadow-lg border border-border p-8 mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Pro Tips</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Use Hints Wisely</h3>
                <p className="text-sm text-muted-foreground">
                  Hints show the first letter and word length. Use them when you're stuck!
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Take Your Time</h3>
                <p className="text-sm text-muted-foreground">
                  There's no time limit. Read carefully and think about context.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-success" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Context Matters</h3>
                <p className="text-sm text-muted-foreground">
                  Consider the sentence context to determine the correct homophone.
                </p>
              </div>
            </div>
          </div>

          {/* Start Game Button */}
          <div className="text-center">
            <button
              onClick={handleStartGame}
              className="group px-8 py-4 bg-accent text-accent-foreground rounded-xl hover:bg-accent/90 transition-all duration-300 accent-hover font-semibold text-lg"
            >
              <div className="flex items-center gap-3">
                <Play className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span>Start Playing Now!</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
