import {
  UserData,
  UserStats,
  GameResult,
  LeaderboardEntry,
  GameTransaction,
} from '@shared/types/server';

export class ServerApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = '/api';
  }

  // User API methods
  async syncUser(username: string): Promise<{
    userData: UserData;
    gems: number;
  }> {
    const response = await fetch(`${this.baseUrl}/users/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) {
      throw new Error(`Failed to sync user: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async getUserData(username: string): Promise<{
    userData: UserData;
    gems: number;
  }> {
    const response = await fetch(`${this.baseUrl}/users/${username}`);

    if (!response.ok) {
      throw new Error(`Failed to get user data: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async getUserStats(username: string): Promise<UserStats> {
    const response = await fetch(`${this.baseUrl}/users/${username}/stats`);

    if (!response.ok) {
      throw new Error(`Failed to get user stats: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async getUserTransactions(username: string, limit: number = 50): Promise<GameTransaction[]> {
    const response = await fetch(`${this.baseUrl}/users/${username}/transactions?limit=${limit}`);

    if (!response.ok) {
      throw new Error(`Failed to get user transactions: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async addGems(username: string, amount: number, reason: string): Promise<{ gems: number }> {
    const response = await fetch(`${this.baseUrl}/users/${username}/gems`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount, reason }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add gems: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async getUserRank(username: string): Promise<{
    dailyRank: number;
    allTimeRank: number;
    weeklyRank: number;
    monthlyRank: number;
  }> {
    const response = await fetch(`${this.baseUrl}/users/${username}/rank`);

    if (!response.ok) {
      throw new Error(`Failed to get user rank: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async getUserPerformance(username: string, days: number = 30): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/users/${username}/performance?days=${days}`);

    if (!response.ok) {
      throw new Error(`Failed to get user performance: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  // Game API methods
  async submitGameResult(gameData: {
    username: string;
    challengeId: string;
    score: number;
    hintsUsed: number;
    freeHintsUsed: number;
    gemsSpent: number;
    timeSpent: number;
    difficulty: 'easy' | 'medium' | 'hard';
    themeName: string;
  }): Promise<GameResult> {
    const response = await fetch(`${this.baseUrl}/games/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gameData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Failed to submit game: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async getGameResult(gameId: string): Promise<GameResult> {
    const response = await fetch(`${this.baseUrl}/games/${gameId}`);

    if (!response.ok) {
      throw new Error(`Failed to get game result: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async canPlayGame(
    username: string,
    challengeId: string
  ): Promise<{
    canPlay: boolean;
    reason?: string;
    gemsAvailable: number;
  }> {
    const response = await fetch(`${this.baseUrl}/games/can-play/${username}/${challengeId}`);

    if (!response.ok) {
      throw new Error(`Failed to check if can play game: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async getUserGames(
    username: string,
    options?: {
      date?: string;
      challengeId?: string;
    }
  ): Promise<GameResult[]> {
    let url = `${this.baseUrl}/games/history/${username}`;
    const params = new URLSearchParams();

    if (options?.date) params.append('date', options.date);
    if (options?.challengeId) params.append('challengeId', options.challengeId);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to get user games: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async getTodayGames(username: string): Promise<GameResult[]> {
    const response = await fetch(`${this.baseUrl}/games/today/${username}`);

    if (!response.ok) {
      throw new Error(`Failed to get today's games: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async getGameStats(username: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/games/stats/${username}`);

    if (!response.ok) {
      throw new Error(`Failed to get game stats: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async getPerformanceData(username: string, days: number = 30): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/games/performance/${username}?days=${days}`);

    if (!response.ok) {
      throw new Error(`Failed to get performance data: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  // Leaderboard API methods
  async getDailyLeaderboard(
    date?: string,
    limit: number = 100
  ): Promise<{
    date: string;
    entries: LeaderboardEntry[];
    totalPlayers: number;
    lastUpdated: string;
  }> {
    let url = `${this.baseUrl}/leaderboard/daily?limit=${limit}`;
    if (date) url += `&date=${date}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to get daily leaderboard: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async getAllTimeLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
    const response = await fetch(`${this.baseUrl}/leaderboard/all-time?limit=${limit}`);

    if (!response.ok) {
      throw new Error(`Failed to get all-time leaderboard: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async getWeeklyLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
    const response = await fetch(`${this.baseUrl}/leaderboard/weekly?limit=${limit}`);

    if (!response.ok) {
      throw new Error(`Failed to get weekly leaderboard: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async getMonthlyLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
    const response = await fetch(`${this.baseUrl}/leaderboard/monthly?limit=${limit}`);

    if (!response.ok) {
      throw new Error(`Failed to get monthly leaderboard: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async getTopPerformers(
    category: 'points' | 'streak' | 'games',
    limit: number = 10
  ): Promise<LeaderboardEntry[]> {
    const response = await fetch(`${this.baseUrl}/leaderboard/top/${category}?limit=${limit}`);

    if (!response.ok) {
      throw new Error(`Failed to get top performers: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async getLeaderboardStats(): Promise<{
    totalPlayers: number;
    totalGamesPlayed: number;
    totalPointsEarned: number;
    averageScore: number;
    topPlayer: string;
    mostActivePlayer: string;
  }> {
    const response = await fetch(`${this.baseUrl}/leaderboard/stats`);

    if (!response.ok) {
      throw new Error(`Failed to get leaderboard stats: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async getUserLeaderboardPosition(username: string): Promise<{
    dailyRank: number;
    allTimeRank: number;
    weeklyRank: number;
    monthlyRank: number;
  }> {
    const response = await fetch(`${this.baseUrl}/leaderboard/position/${username}`);

    if (!response.ok) {
      throw new Error(`Failed to get user leaderboard position: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  async getUserRank(
    username: string,
    isDaily: boolean = false
  ): Promise<{
    rank: number | null;
    isDaily: boolean;
  }> {
    const response = await fetch(`${this.baseUrl}/leaderboard/rank/${username}?daily=${isDaily}`);

    if (!response.ok) {
      throw new Error(`Failed to get user rank: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }
}

// Create singleton instance
export const serverApi = new ServerApiService();
