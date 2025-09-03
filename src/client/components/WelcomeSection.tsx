interface WelcomeSectionProps {
  username?: string | null | undefined;
}

export const WelcomeSection = ({ username }: WelcomeSectionProps) => {
  return (
    <div className="flex flex-col items-center gap-4 animate-fade-in-up-delay-1">
      <h1 className="text-5xl md:text-6xl font-black text-center text-gradient drop-shadow-lg">
        {username ? `Welcome Back!` : 'Reddit Game'}
      </h1>
      {username && (
        <div className="glass-morphism rounded-2xl px-6 py-3">
          <p className="text-2xl font-semibold text-white/90 drop-shadow-md">Hey {username} 👋</p>
        </div>
      )}
      <p className="text-lg text-center text-white/80 max-w-md leading-relaxed drop-shadow-md font-medium">
        Experience the next generation of interactive gaming. Your adventure starts here.
      </p>
    </div>
  );
};
