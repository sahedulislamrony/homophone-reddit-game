import { Home, Info } from 'lucide-react';

export default function NavigationBar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900">
      <button className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700 transition-colors">
        <Home size={20} />
      </button>

      <h1 className="text-white text-lg font-medium">My Game</h1>

      <button className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700 transition-colors">
        <Info size={20} />
      </button>
    </nav>
  );
}
