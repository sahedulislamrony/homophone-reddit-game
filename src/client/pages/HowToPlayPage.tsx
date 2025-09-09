import NavigationBar from '@client/components/basic/Navigation';
import { useRouter } from '@client/contexts/RouterContext';
import { Home, Play, Lightbulb, Target, Award, Clock, BarChart3, ArrowLeft } from 'lucide-react';

export default function HowToPlayPage() {
  const router = useRouter();

  const handleStartGame = () => {
    router.goto('game');
  };

  return (
    <div
      className="w-full min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: "url('/root_bg.png')" }}
    >
      {/* Dark overlay for better text readability */}
      <div className="w-full min-h-screen bg-black/70 flex items-center justify-center p-6">
        <div className="max-w-4xl w-full mx-auto">
          {/* Navigation Buttons */}
          <NavigationBar title="How to Play" onBack={() => router.goto('home')} />
          {/* Header */}

          {/* Main Instructions Card */}
          <div className="bg-black/85 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700 p-8 mb-8">
            <div className="text-center mb-8">
              <Target className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-4">The Objective</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                Find the wrong words in the given text and replace them with the correct homophones.
                <br />
                <span className="text-yellow-400 font-semibold">
                  Homophones are words that sound the same but have different meanings and
                  spellings.
                </span>
              </p>
            </div>

            {/* Example Section */}
            <div className="bg-black/60 backdrop-blur-sm rounded-xl p-6 mb-8">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Example
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-400 mb-2">Given text:</p>
                  <div className="bg-black/50 rounded-lg p-4 border border-gray-700">
                    <p className="text-gray-100 text-lg">
                      "I went to the{' '}
                      <span className="text-red-400 font-semibold underline decoration-red-400">
                        store
                      </span>{' '}
                      and{' '}
                      <span className="text-red-400 font-semibold underline decoration-red-400">
                        board
                      </span>{' '}
                      a car."
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 mb-2">Corrected text:</p>
                  <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-4">
                    <p className="text-gray-100 text-lg">
                      "I went to the <span className="text-green-400 font-semibold">store</span> and{' '}
                      <span className="text-green-400 font-semibold">bought</span> a car."
                    </p>
                  </div>
                </div>
                <div className="text-sm text-gray-400">
                  <strong>Explanation:</strong> "board" should be "bought" - they sound similar but
                  have different meanings.
                </div>
              </div>
            </div>

            {/* Game Rules */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Play className="w-5 h-5 text-yellow-400" />
                  How to Play
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-yellow-400/20 text-yellow-400 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <span>Read the themed text carefully</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-yellow-400/20 text-yellow-400 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <span>Identify words that sound correct but are spelled wrong</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-yellow-400/20 text-yellow-400 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <span>Type the correct homophone in the input box</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 bg-yellow-400/20 text-yellow-400 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      4
                    </span>
                    <span>Submit your answer and earn points</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Scoring
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span>
                      <strong>Correct answer:</strong> +10 points
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <span>
                      <strong>Wrong answer:</strong> 0 points
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span>
                      <strong>Using hints:</strong> No penalty
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span>
                      <strong>Complete game:</strong> Bonus points
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-black/85 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700 p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Pro Tips</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Use Hints Wisely</h3>
                <p className="text-sm text-gray-400">
                  Hints show the first letter and word length. Use them when you're stuck!
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Take Your Time</h3>
                <p className="text-sm text-gray-400">
                  There's no time limit. Read carefully and think about context.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">Context Matters</h3>
                <p className="text-sm text-gray-400">
                  Consider the sentence context to determine the correct homophone.
                </p>
              </div>
            </div>
          </div>

          {/* Start Game Button */}
          <div className="text-center">
            <button
              onClick={handleStartGame}
              className="group w-full max-w-sm mx-auto py-3 px-6 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
            >
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Start Playing Now!</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
