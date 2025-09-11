import { useState, useCallback } from 'react';

// Hook for managing loading state
export const useUnifiedLoader = (initialState: boolean = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [message, setMessage] = useState<string>('');

  const startLoading = useCallback((loadingMessage?: string) => {
    setMessage(loadingMessage || '');
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setMessage('');
  }, []);

  const setLoadingMessage = useCallback((newMessage: string) => {
    setMessage(newMessage);
  }, []);

  return {
    isLoading,
    message,
    startLoading,
    stopLoading,
    setLoadingMessage,
  };
};
