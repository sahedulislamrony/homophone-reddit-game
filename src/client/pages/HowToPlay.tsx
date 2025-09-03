import { useRouter } from '@client/contexts/RouterContext';

export default function HowToPlayPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">HOW TO PLAY</h1>
        <p className="text-xl text-gray-300">Learn the rules and strategies</p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto bg-gray-800 border-4 border-gray-900 rounded-lg p-6 shadow-2xl">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-green-400 mb-4 flex items-center">
            <span className="bg-green-600 w-6 h-6 rounded mr-2"></span>
            EASY LEVEL
          </h2>
          <ul className="list-disc list-inside text-gray-300 ml-6 space-y-2">
            <li>Collect as many coins as possible in 3 minutes</li>
            <li>Avoid the green creepers - they reduce your score</li>
            <li>Break blue blocks for bonus points</li>
            <li>Complete all objectives to unlock the next level</li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center">
            <span className="bg-yellow-600 w-6 h-6 rounded mr-2"></span>
            MEDIUM LEVEL
          </h2>
          <ul className="list-disc list-inside text-gray-300 ml-6 space-y-2">
            <li>Time limit reduced to 2 minutes</li>
            <li>More creepers and obstacles appear</li>
            <li>Special diamond blocks give 5x points</li>
            <li>Find the hidden golden block for a surprise</li>
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-red-400 mb-4 flex items-center">
            <span className="bg-red-600 w-6 h-6 rounded mr-2"></span>
            HARD LEVEL
          </h2>
          <ul className="list-disc list-inside text-gray-300 ml-6 space-y-2">
            <li>Only 1 minute to collect maximum points</li>
            <li>Creepers move faster and are more numerous</li>
            <li>Exploding TNT blocks remove points if touched</li>
            <li>Complete the level to earn a place on the leaderboard</li>
          </ul>
        </div>

        <div className="bg-gray-900 p-4 rounded border-2 border-gray-700">
          <h3 className="text-lg font-bold text-blue-400 mb-2">PRO TIPS</h3>
          <p className="text-gray-400">
            Focus on collecting clusters of coins rather than individual ones. Watch the timer and
            plan your route to maximize efficiency. Remember that higher difficulties give more
            points per coin!
          </p>
        </div>
      </div>

      {/* Back Button */}
      <div className="text-center mt-8">
        <button
          onClick={() => router.goto('home')}
          className="px-8 py-3 bg-gradient-to-b from-gray-600 to-gray-800 border-4 border-gray-900 rounded-lg text-xl font-bold hover:from-gray-700 hover:to-gray-900 transition-all"
        >
          BACK TO HOME
        </button>
      </div>
    </div>
  );
}
