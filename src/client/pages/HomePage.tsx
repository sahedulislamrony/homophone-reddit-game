import { useRouter } from '@client/contexts/RouterContext';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      {/* Logo and Game Name */}
      <div className="mb-12">
        <div className="mx-auto w-32 h-32 bg-gradient-to-b from-blue-500 to-blue-700 border-4 border-gray-800 rounded-lg shadow-2xl transform rotate-6"></div>
        <h1 className="text-5xl font-bold mt-6 text-yellow-400 tracking-wider">BLOCK CRAFT</h1>
        <p className="text-xl mt-2 text-gray-300">A Reddit Adventure</p>
      </div>

      {/* Buttons */}
      <div className="max-w-md mx-auto space-y-6">
        <button
          onClick={() => router.goto('game')}
          className="w-full py-4 bg-gradient-to-b from-green-600 to-green-800 border-4 border-gray-900 rounded-lg text-2xl font-bold hover:from-green-700 hover:to-green-900 transition-all transform hover:scale-105 shadow-2xl"
        >
          START GAME
        </button>

        <button
          onClick={() => router.goto('leaderboard')}
          className="w-full py-4 bg-gradient-to-b from-yellow-600 to-yellow-800 border-4 border-gray-900 rounded-lg text-2xl font-bold hover:from-yellow-700 hover:to-yellow-900 transition-all transform hover:scale-105 shadow-2xl"
        >
          SEE LEADERBOARD
        </button>

        <button
          onClick={() => router.goto('how-to-play')}
          className="w-full py-4 bg-gradient-to-b from-blue-600 to-blue-800 border-4 border-gray-900 rounded-lg text-2xl font-bold hover:from-blue-700 hover:to-blue-900 transition-all transform hover:scale-105 shadow-2xl"
        >
          HOW TO PLAY
        </button>
      </div>

      {/* Decorative Blocks */}
      <div className="fixed bottom-4 left-4 flex space-x-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-12 h-12 bg-gradient-to-b from-brown-600 to-brown-800 border-4 border-gray-900 rounded"
          ></div>
        ))}
      </div>

      <div className="fixed bottom-4 right-4 flex space-x-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-12 h-12 bg-gradient-to-b from-stone-600 to-stone-800 border-4 border-gray-900 rounded"
          ></div>
        ))}
      </div>
    </div>
  );
}
