import { ArrowLeft, Gem } from 'lucide-react';

interface NavigationBarProps {
  title: string;
  onBack: () => void;
  onStats?: () => void;
}

export default function NavigationBar({ title, onBack, onStats = () => {} }: NavigationBarProps) {
  return (
    <nav className="flex items-center justify-between mb-8 w-full max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="py-2 px-4 bg-black group hover:bg-yellow-400 hover:text-black font-bold backdrop-blur-sm border border-gray-700 rounded-full  transition-all duration-300 flex items-center gap-2"
      >
        <ArrowLeft className="w-5 h-5 text-gray-200 group-hover:text-black" />
        <span className="text-gray-200 group-hover:text-black">Back</span>
      </button>

      <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
        {title}
      </h1>

      <button
        onClick={onStats}
        className="py-2 px-4 group bg-black hover:bg-yellow-400 font-bold backdrop-blur-sm border border-gray-700 rounded-full  transition-all duration-300 flex items-center gap-2"
      >
        <Gem className="w-5 h-5 text-yellow-400 group-hover:text-black" />
      </button>
    </nav>
  );
}
