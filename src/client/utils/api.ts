import { UserDataResponse, ApiError } from '@shared/types/api';

export const createApiError = (message: string, status?: number): ApiError => {
  const error = new Error(message) as ApiError;
  error.name = 'ApiError';
  if (status !== undefined) {
    error.status = status;
  }
  return error;
};

const baseUrl = '/api';

const getUserData = async (): Promise<UserDataResponse> => {
  try {
    const response = await fetch(`${baseUrl}/user`);

    if (!response.ok) {
      throw createApiError(`HTTP error! status: ${response.status}`, response.status);
    }

    const data = await response.json();
    return data as UserDataResponse;
  } catch (error) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ApiError') {
      throw error;
    }
    throw createApiError('Failed to fetch user data');
  }
};

export const userApi = {
  getUserData,
};
