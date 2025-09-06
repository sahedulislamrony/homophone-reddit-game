import { Home, Info } from 'lucide-react';

export default function NavigationBar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-background border-b border-secondary/20">
      <button className="w-10 h-10 rounded-lg bg-card border border-secondary flex items-center justify-center text-foreground hover:bg-secondary/50 transition-colors">
        <Home size={20} />
      </button>

      <h1 className="text-foreground text-lg font-medium">My Game</h1>

      <button className="w-10 h-10 rounded-lg bg-card border border-secondary flex items-center justify-center text-foreground hover:bg-secondary/50 transition-colors">
        <Info size={20} />
      </button>
    </nav>
  );
}
