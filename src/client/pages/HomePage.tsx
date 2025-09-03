import { useRouter } from '@client/contexts/RouterContext';
import { Gamepad2, LucideIcon } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="mx mx-auto px-4 py-8 pt-15 flex flex-col items-center justify-start h-full">
      {/* Logo and Game Name */}
      <div className="mb-12">
        <div className=" flex justify-center items-center w-full">
          <img
            className="size-30 text-4xl font-bold text-primary mb-2 rounded-full"
            src="/logo.png"
            alt="Logo"
          />
        </div>
        <h1 className="text-5xl font-bold mt-6 text-primary tracking-wider">Minddit4u</h1>
      </div>

      {/* Buttons */}
      <div className="w-full flex flex-col gap-6 justify-center items-center">
        <Button text="Play Now" onClick={() => router.goto('game')} Icon={Gamepad2} />
        <Button text="Leaderboard" onClick={() => router.goto('leaderboard')} Icon={Gamepad2} />
        <Button text="How to Play" onClick={() => router.goto('how-to-play')} Icon={Gamepad2} />
      </div>
    </div>
  );
}

function Button({ text, onClick, Icon }: { text: string; onClick?: () => void; Icon: LucideIcon }) {
  return (
    <button
      className="w-full max-w-md py-4  border-primary rounded-full text-lg font-bold border-4 text-white flex items-center justify-center gap-5 hover:bg-primary/10 transition-colors"
      onClick={onClick}
    >
      <Icon className="size-8" />
      {text}
    </button>
  );
}
