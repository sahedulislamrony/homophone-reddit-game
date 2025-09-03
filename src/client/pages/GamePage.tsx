import { useRouter } from '../contexts/RouterContext';

export default function GamePage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">SELECT DIFFICULTY</h1>
        <p className="text-xl text-gray-300">Choose your challenge level</p>
      </div>

      {/* Difficulty Options */}
      <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          onClick={() => console.log('Easy selected')}
          className="cursor-pointer p-6 bg-gradient-to-b from-green-600 to-green-800 border-4 border-gray-900 rounded-lg text-center hover:from-green-700 hover:to-green-900 transition-all transform hover:scale-105 shadow-2xl"
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-b from-lime-400 to-lime-600 border-4 border-gray-900 rounded-lg mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">EASY</h2>
          <p className="text-gray-300">For beginners</p>
        </div>

        <div
          onClick={() => console.log('Medium selected')}
          className="cursor-pointer p-6 bg-gradient-to-b from-yellow-600 to-yellow-800 border-4 border-gray-900 rounded-lg text-center hover:from-yellow-700 hover:to-yellow-900 transition-all transform hover:scale-105 shadow-2xl"
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-b from-gold-400 to-gold-600 border-4 border-gray-900 rounded-lg mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">MEDIUM</h2>
          <p className="text-gray-300">For experienced players</p>
        </div>

        <div
          onClick={() => console.log('Hard selected')}
          className="cursor-pointer p-6 bg-gradient-to-b from-red-600 to-red-800 border-4 border-gray-900 rounded-lg text-center hover:from-red-700 hover:to-red-900 transition-all transform hover:scale-105 shadow-2xl"
        >
          <div className="w-20 h-20 mx-auto bg-gradient-to-b from-red-400 to-red-600 border-4 border-gray-900 rounded-lg mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">HARD</h2>
          <p className="text-gray-300">For experts only</p>
        </div>
      </div>

      {/* Back Button */}
      <div className="text-center mt-12">
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
