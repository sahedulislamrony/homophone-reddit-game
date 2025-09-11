import React from 'react';
import { Loader2, Zap, Target, Trophy, Gamepad2 } from 'lucide-react';

export type LoaderVariant = 'default' | 'game' | 'challenge' | 'leaderboard' | 'stats';
export type LoaderSize = 'sm' | 'md' | 'lg' | 'xl';

interface UnifiedLoaderProps {
  isLoading: boolean;
  children?: React.ReactNode;
  variant?: LoaderVariant;
  size?: LoaderSize;
  message?: string;
  showBackground?: boolean;
  className?: string;
}

const getVariantConfig = (variant: LoaderVariant) => {
  switch (variant) {
    case 'game':
      return {
        icon: Gamepad2,
        primaryColor: 'text-blue-400',
        secondaryColor: 'text-blue-200',
        bgColor: 'bg-blue-500/10',
        borderColor: 'border-blue-400/30',
        message: 'Loading game...',
      };
    case 'challenge':
      return {
        icon: Target,
        primaryColor: 'text-yellow-400',
        secondaryColor: 'text-yellow-200',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-400/30',
        message: 'Loading challenges...',
      };
    case 'leaderboard':
      return {
        icon: Trophy,
        primaryColor: 'text-purple-400',
        secondaryColor: 'text-purple-200',
        bgColor: 'bg-purple-500/10',
        borderColor: 'border-purple-400/30',
        message: 'Loading leaderboard...',
      };
    case 'stats':
      return {
        icon: Zap,
        primaryColor: 'text-green-400',
        secondaryColor: 'text-green-200',
        bgColor: 'bg-green-500/10',
        borderColor: 'border-green-400/30',
        message: 'Loading stats...',
      };
    default:
      return {
        icon: Loader2,
        primaryColor: 'text-gray-400',
        secondaryColor: 'text-gray-200',
        bgColor: 'bg-gray-500/10',
        borderColor: 'border-gray-400/30',
        message: 'Loading...',
      };
  }
};

const getSizeConfig = (size: LoaderSize) => {
  switch (size) {
    case 'sm':
      return {
        container: 'w-8 h-8',
        icon: 'w-4 h-4',
        text: 'text-sm',
        spacing: 'space-y-2',
      };
    case 'md':
      return {
        container: 'w-12 h-12',
        icon: 'w-6 h-6',
        text: 'text-base',
        spacing: 'space-y-3',
      };
    case 'lg':
      return {
        container: 'w-16 h-16',
        icon: 'w-8 h-8',
        text: 'text-lg',
        spacing: 'space-y-4',
      };
    case 'xl':
      return {
        container: 'w-20 h-20',
        icon: 'w-10 h-10',
        text: 'text-xl',
        spacing: 'space-y-5',
      };
    default:
      return {
        container: 'w-12 h-12',
        icon: 'w-6 h-6',
        text: 'text-base',
        spacing: 'space-y-3',
      };
  }
};

export const UnifiedLoader: React.FC<UnifiedLoaderProps> = ({
  isLoading,
  children,
  variant = 'default',
  size = 'lg',
  message,
  showBackground = true,
  className = '',
}) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  const variantConfig = getVariantConfig(variant);
  const sizeConfig = getSizeConfig(size);
  const IconComponent = variantConfig.icon;
  const displayMessage = message || variantConfig.message;

  const LoaderContent = () => (
    <div className={`flex flex-col items-center ${sizeConfig.spacing} ${className}`}>
      {/* Smart Spinning Animation */}
      <div className="relative">
        {/* Outer ring with gradient */}
        <div
          className={`${sizeConfig.container} rounded-full border-4 ${variantConfig.borderColor} ${variantConfig.bgColor} flex items-center justify-center relative overflow-hidden`}
        >
          {/* Inner spinning ring */}
          <div
            className={`absolute inset-1 rounded-full border-2 ${variantConfig.primaryColor} border-t-transparent animate-spin`}
            style={{
              animationDuration: '1.2s',
              animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />

          {/* Pulsing center dot */}
          <div
            className={`w-1.5 h-1.5 ${variantConfig.primaryColor} rounded-full animate-pulse`}
            style={{
              animationDuration: '1.5s',
              animationTimingFunction: 'ease-in-out',
            }}
          />

          {/* Icon overlay (optional) */}
          {variant !== 'default' && (
            <IconComponent
              className={`${sizeConfig.icon} ${variantConfig.secondaryColor} absolute animate-pulse`}
              style={{
                animationDuration: '2s',
                animationTimingFunction: 'ease-in-out',
              }}
            />
          )}
        </div>

        {/* Orbiting dots */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
          <div
            className={`absolute w-1 h-1 ${variantConfig.primaryColor} rounded-full`}
            style={{
              top: '4px',
              left: '50%',
              transform: 'translateX(-50%)',
              opacity: 0.8,
            }}
          />
          <div
            className={`absolute w-1 h-1 ${variantConfig.secondaryColor} rounded-full`}
            style={{
              bottom: '4px',
              right: '4px',
              opacity: 0.6,
            }}
          />
        </div>
      </div>

      {/* Loading message */}
      {displayMessage && (
        <div
          className={`${sizeConfig.text} ${variantConfig.secondaryColor} font-medium text-center`}
        >
          <span className="animate-pulse">{displayMessage}</span>
        </div>
      )}
    </div>
  );

  if (showBackground) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
        <LoaderContent />
      </div>
    );
  }

  return <LoaderContent />;
};

// Inline loader for smaller spaces
export const InlineLoader: React.FC<Omit<UnifiedLoaderProps, 'showBackground' | 'children'>> = (
  props
) => {
  return <UnifiedLoader {...props} showBackground={false} />;
};

// Full screen loader
export const FullScreenLoader: React.FC<Omit<UnifiedLoaderProps, 'showBackground' | 'children'>> = (
  props
) => {
  return <UnifiedLoader {...props} showBackground={true} />;
};

export default UnifiedLoader;
