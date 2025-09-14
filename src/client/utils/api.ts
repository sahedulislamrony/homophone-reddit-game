import { UserDataResponse, ApiError } from '@shared/types/api';
import { UserData, UserStats, GameResult, LeaderboardEntry } from '@shared/types/server';

export const createApiError = (message: string, status?: number): ApiError => {
  const error = new Error(message) as ApiError;
  error.name = 'ApiError';
  if (status !== undefined) {
    error.status = status;
  }
  return error;
};

const baseUrl = '/api';

// User API methods
const getCurrentRedditUser = async (): Promise<UserDataResponse> => {
  try {
    const response = await fetch(`${baseUrl}/users/current`);

    if (!response.ok) {
      throw createApiError(`HTTP error! status: ${response.status}`, response.status);
    }

    const data = await response.json();
    return data.data as UserDataResponse;
  } catch (error) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ApiError') {
      throw error;
    }
    throw createApiError('Failed to fetch current user data');
  }
};

const syncUser = async (username: string): Promise<{ userData: UserData; gems: number }> => {
  try {
    const response = await fetch(`${baseUrl}/users/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      throw createApiError(`HTTP error! status: ${response.status}`, response.status);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ApiError') {
      throw error;
    }
    throw createApiError('Failed to sync user');
  }
};

const getUserData = async (username: string): Promise<{ userData: UserData; gems: number }> => {
  try {
    const response = await fetch(`${baseUrl}/users/${username}`);

    if (!response.ok) {
      throw createApiError(`HTTP error! status: ${response.status}`, response.status);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ApiError') {
      throw error;
    }
    throw createApiError('Failed to fetch user data');
  }
};

const getUserStats = async (username: string): Promise<UserStats> => {
  try {
    const response = await fetch(`${baseUrl}/users/${username}/stats`);

    if (!response.ok) {
      throw createApiError(`HTTP error! status: ${response.status}`, response.status);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ApiError') {
      throw error;
    }
    throw createApiError('Failed to fetch user stats');
  }
};

// Game API methods
const submitGameResult = async (gameData: {
  username: string;
  challengeId: string;
  score: number;
  hintsUsed: number;
  freeHintsUsed: number;
  gemsSpent: number;
  timeSpent: number;
  difficulty: 'easy' | 'medium' | 'hard';
  themeName: string;
}): Promise<GameResult> => {
  try {
    const response = await fetch(`${baseUrl}/games/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw createApiError(
        errorData.error || `HTTP error! status: ${response.status}`,
        response.status
      );
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ApiError') {
      throw error;
    }
    throw createApiError('Failed to submit game result');
  }
};

const getTodayGames = async (username: string, date?: string): Promise<GameResult[]> => {
  try {
    const url = date
      ? `${baseUrl}/games/today/${username}?date=${date}`
      : `${baseUrl}/games/today/${username}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw createApiError(`HTTP error! status: ${response.status}`, response.status);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ApiError') {
      throw error;
    }
    throw createApiError("Failed to fetch today's games");
  }
};

// Leaderboard API methods
const getDailyLeaderboard = async (
  date?: string,
  limit: number = 100
): Promise<{
  date: string;
  entries: LeaderboardEntry[];
  totalPlayers: number;
  lastUpdated: string;
}> => {
  try {
    let url = `${baseUrl}/leaderboard/daily?limit=${limit}`;
    if (date) url += `&date=${date}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw createApiError(`HTTP error! status: ${response.status}`, response.status);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ApiError') {
      throw error;
    }
    throw createApiError('Failed to fetch daily leaderboard');
  }
};

const getAllTimeLeaderboard = async (limit: number = 100): Promise<LeaderboardEntry[]> => {
  try {
    const response = await fetch(`${baseUrl}/leaderboard/all-time?limit=${limit}`);

    if (!response.ok) {
      throw createApiError(`HTTP error! status: ${response.status}`, response.status);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ApiError') {
      throw error;
    }
    throw createApiError('Failed to fetch all-time leaderboard');
  }
};

const getUserRank = async (
  username: string
): Promise<{
  dailyRank: number;
  allTimeRank: number;
  weeklyRank: number;
  monthlyRank: number;
  dailyPoints: number;
  totalPoints: number;
}> => {
  try {
    const response = await fetch(`${baseUrl}/leaderboard/position/${username}`);

    if (!response.ok) {
      throw createApiError(`HTTP error! status: ${response.status}`, response.status);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ApiError') {
      throw error;
    }
    throw createApiError('Failed to fetch user rank');
  }
};

const getGameResult = async (gameId: string): Promise<GameResult | null> => {
  try {
    const response = await fetch(`${baseUrl}/games/${gameId}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Game not found
      }
      throw createApiError(`HTTP error! status: ${response.status}`, response.status);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ApiError') {
      throw error;
    }
    throw createApiError('Failed to fetch game result');
  }
};

const getGameResultByChallengeId = async (
  username: string,
  challengeId: string
): Promise<GameResult | null> => {
  try {
    const response = await fetch(`${baseUrl}/games/challenge/${username}/${challengeId}`);

    if (!response.ok) {
      if (response.status === 404) {
        return null; // Game result not found
      }
      throw createApiError(`HTTP error! status: ${response.status}`, response.status);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ApiError') {
      throw error;
    }
    throw createApiError('Failed to fetch game result by challenge ID');
  }
};

const spendGems = async (username: string, amount: number): Promise<boolean> => {
  try {
    const response = await fetch(`${baseUrl}/games/spend-gems/${username}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      if (response.status === 400) {
        return false; // Insufficient gems
      }
      throw createApiError(`HTTP error! status: ${response.status}`, response.status);
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    if (error && typeof error === 'object' && 'name' in error && error.name === 'ApiError') {
      throw error;
    }
    throw createApiError('Failed to spend gems');
  }
};

export const userApi = {
  getCurrentRedditUser,
  syncUser,
  getUserData,
  getUserStats,
  submitGameResult,
  getTodayGames,
  getGameResult,
  getGameResultByChallengeId,
  spendGems,
  getDailyLeaderboard,
  getAllTimeLeaderboard,
  getUserRank,
};
