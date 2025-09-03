import React from 'react';

interface SplashBackgroundProps {
  children: React.ReactNode;
}

export const SplashBackground = ({ children }: SplashBackgroundProps) => {
  return (
    <div
      className="relative min-h-screen overflow-hidden bg-gradient-primary animate-gradient-shift"
      style={{
        backgroundImage: `url('background.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
      }}
    >
      {/* Overlay for better content visibility */}
      <div className="absolute inset-0 bg-black/20 z-0"></div>

      {/* Decorative gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-purple-500/20 z-0"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500/10 via-transparent to-pink-500/10 z-0"></div>

      {children}
    </div>
  );
};
