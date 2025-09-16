import { useRouter } from '@client/contexts/RouterContext';
import { ArrowLeft, HomeIcon } from 'lucide-react';

interface NavigationBarProps {
  title: string;
  onBack: () => void;
  onHome?: () => void;
}

export default function NavigationBar({ title, onBack, onHome = () => {} }: NavigationBarProps) {
  const router = useRouter();
  const handleHome = () => {
    if (onHome) {
      onHome();
    }
    router.goto('home');
  };
  return (
    <nav className="flex items-center justify-between pt-2 pb-2 w-full max-w-4xl mx-auto px-4 mt-1 z-50">
      <button
        onClick={onBack}
        className="p-2.5 bg-white/10 group hover:bg-yellow-400  border-0  backdrop-blur-sm    rounded-full  transition-all duration-300 flex items-center "
      >
        <ArrowLeft className="w-5 h-5 text-yellow-400 group-hover:text-black" />
      </button>

      <h1 className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
        {title}
      </h1>

      <button
        onClick={handleHome}
        className="p-2.5 bg-white/10 group hover:bg-yellow-400 backdrop-blur-sm border-0    rounded-full  transition-all duration-300 flex items-center "
      >
        <HomeIcon className="w-5 h-5 text-yellow-400 group-hover:text-black" />
      </button>
    </nav>
  );
}
