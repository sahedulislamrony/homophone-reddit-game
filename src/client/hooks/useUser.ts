import { useState, useEffect } from 'react';
import { UserDataResponse, ApiError } from '@shared/types/api';
import { userApi } from '../utils/api';

interface UseUserReturn {
  user: UserDataResponse | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useUser = (): UseUserReturn => {
  const [user, setUser] = useState<UserDataResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const userData = await userApi.getCurrentRedditUser();
      setUser(userData);
    } catch (err) {
      let errorMessage = 'Failed to fetch user data';

      if (err && typeof err === 'object' && 'name' in err && err.name === 'ApiError') {
        errorMessage = (err as ApiError).message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }

      setError(errorMessage);
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchUser();
  }, []);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
};
