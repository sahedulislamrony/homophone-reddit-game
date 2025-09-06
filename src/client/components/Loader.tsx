import React from 'react';

interface LoaderProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export const Loader: React.FC<LoaderProps> = ({ isLoading, children }) => {
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          </div>
          <div className="text-sm text-muted-foreground font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Hook for simulating loading with sleep
export const useLoading = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const startLoading = React.useCallback(async (duration: number = 1000) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, duration));
    setIsLoading(false);
  }, []);

  return { isLoading, startLoading };
};
