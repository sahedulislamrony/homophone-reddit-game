import NavigationBar from '@client/components/basic/Navigation';
import { useRouter } from '@client/contexts/RouterContext';
import { Play, Lightbulb, Target, Award } from 'lucide-react';

export default function HowToPlayPage() {
  const router = useRouter();

  const handleStartGame = () => {
    router.goto('daily-challenges');
  };

  return (
    <div className="w-full min-h-screen bg-transparent flex items-center justify-center p-6">
      <div className=" w-full mx-auto">
        {/* Navigation Buttons */}
        <NavigationBar title="How to Play" onBack={() => router.goto('home')} />
        {/* Header */}

        {/* Main Instructions Card */}
        <div className="bg-transparent  rounded-2xl shadow-lg  p-8 mb-8">
          <div className="text-center mb-8">
            <Target className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">The Objective</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              Find the wrong words in the given text and replace them with the correct homophones.
              <br />
              <span className="text-yellow-400 font-semibold">
                Homophones are words that sound the same but have different meanings and spellings.
              </span>
            </p>
          </div>

          {/* Example Section */}
          <div className="bg-transparent   rounded-xl p-6 mb-8">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-400" />
              Example
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400 mb-2">Given text:</p>
                <div className="bg-black/50 rounded-lg p-4 border border-gray-700">
                  <p className="text-gray-100 text-lg">
                    "I went to the store and{' '}
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
                    "I went to the store and{' '}
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
              <ul className="space-y-3 text-gray-300 ml-6">
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
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-yellow-400/20 text-yellow-400 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                    5
                  </span>
                  <span>Build streaks for bonus points!</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Scoring System
              </h3>
              <ul className="space-y-3 text-gray-300 ml-6">
                <li className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span>
                    <strong>1st correct:</strong> Base points (varies by theme)
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span>
                    <strong>2nd consecutive:</strong> Base + 50% bonus
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span>
                    <strong>3rd+ consecutive:</strong> Increasing bonus!
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span>
                    <strong>Wrong answer:</strong> Streak resets to 0
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span>
                    <strong>Using hints:</strong> -2 points, streak resets
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Hints & Gems */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Hints System
              </h3>
              <ul className="space-y-3 text-gray-300 ml-6">
                <li className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span>
                    <strong>Free hints:</strong> 3 per challenge
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span>
                    <strong>Gem hints:</strong> 1 gem = 3 additional hints
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <span>
                    <strong>Hint cost:</strong> -2 points per hint
                  </span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Rewards
              </h3>
              <ul className="space-y-3 text-gray-300 ml-6 ">
                <li className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span>
                    <strong>Gems:</strong> Earned based on theme difficulty
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span>
                    <strong>Leaderboards:</strong> Daily & all-time rankings
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span>
                    <strong>Stats:</strong> Track your progress & streaks
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Server Time Caution */}
        <div className="bg-orange-500/20 border border-orange-500/50 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center mt-0.5">
              <span className="text-red-800 text-sm font-bold">!</span>
            </div>
            <div>
              <h4 className="text-yellow-400 font-semibold text-sm mb-2">Important Notice</h4>
              <p className="text-white text-sm leading-relaxed">
                All game times, daily challenges, and leaderboards are based on{' '}
                <strong className="text-yellow-400">server time</strong>, which may differ from your
                local time. Daily challenges reset at midnight server time, and leaderboard rankings
                are calculated using server time zones.
              </p>
            </div>
          </div>
        </div>

        {/* Start Game Button */}
        <div className="text-center mb-5">
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
  );
}
