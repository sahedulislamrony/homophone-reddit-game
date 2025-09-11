/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverApi } from './ServerApiService';
import { UserData, UserStats, GameResult, LeaderboardEntry } from '@shared/types/server';
import { GameState } from '@shared/types/game';

export class DataSyncService {
  private static instance: DataSyncService;
  private currentUser: string | null = null;
  private userData: UserData | null = null;
  private gems: number = 0;
  private stats: UserStats | null = null;
  private lastSync: number = 0;
  private syncInterval: number = 30000; // 30 seconds

  private constructor() {
    // Auto-sync every 30 seconds
    setInterval(() => {
      if (this.currentUser) {
        void this.syncUserData(this.currentUser);
      }
    }, this.syncInterval);
  }

  static getInstance(): DataSyncService {
    if (!DataSyncService.instance) {
      DataSyncService.instance = new DataSyncService();
    }
    return DataSyncService.instance;
  }

  // Initial data loading
  async loadInitialData(username: string): Promise<{
    userData: UserData;
    gems: number;
    stats: UserStats | null;
  }> {
    try {
      const { userData, gems } = await serverApi.syncUser(username);
      const stats = await serverApi.getUserStats(username);

      this.currentUser = username;
      this.userData = userData;
      this.gems = gems;
      this.stats = stats;
      this.lastSync = Date.now();

      return { userData, gems, stats };
    } catch (error) {
      console.error('Failed to load initial data:', error);
      throw error;
    }
  }

  // Sync user data
  async syncUserData(username: string): Promise<void> {
    try {
      const { userData, gems } = await serverApi.getUserData(username);
      const stats = await serverApi.getUserStats(username);

      this.userData = userData;
      this.gems = gems;
      this.stats = stats;
      this.lastSync = Date.now();
    } catch (error) {
      console.error('Failed to sync user data:', error);
    }
  }

  // Submit game result and sync
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
    try {
      const result = await serverApi.submitGameResult(gameData);

      // Update local data
      if (this.userData) {
        this.userData.totalPoints += gameData.score;
        this.userData.dailyPoints += gameData.score;
        this.gems = this.gems - gameData.gemsSpent + result.gemsEarned;
      }

      // Sync updated data
      await this.syncUserData(gameData.username);

      return result;
    } catch (error) {
      console.error('Failed to submit game result:', error);
      throw error;
    }
  }

  // Get current user data
  getCurrentUserData(): UserData | null {
    return this.userData;
  }

  getCurrentGems(): number {
    return this.gems;
  }

  getCurrentStats(): UserStats | null {
    return this.stats;
  }

  // Check if user can play a challenge
  async canPlayChallenge(
    username: string,
    challengeId: string
  ): Promise<{
    canPlay: boolean;
    reason?: string;
    gemsAvailable: number;
  }> {
    try {
      return await serverApi.canPlayGame(username, challengeId);
    } catch (error) {
      console.error('Failed to check if can play challenge:', error);
      return {
        canPlay: false,
        reason: 'Failed to check game availability',
        gemsAvailable: this.gems,
      };
    }
  }

  // Get leaderboard data
  async getLeaderboardData(
    type: 'daily' | 'weekly' | 'monthly' | 'all-time',
    limit: number = 100
  ): Promise<LeaderboardEntry[]> {
    try {
      switch (type) {
        case 'daily': {
          const daily = await serverApi.getDailyLeaderboard(undefined, limit);
          return daily.entries;
        }
        case 'weekly':
          return await serverApi.getWeeklyLeaderboard(limit);
        case 'monthly':
          return await serverApi.getMonthlyLeaderboard(limit);
        case 'all-time':
          return await serverApi.getAllTimeLeaderboard(limit);
        default:
          return [];
      }
    } catch (error) {
      console.error(`Failed to get ${type} leaderboard:`, error);
      return [];
    }
  }

  // Get user performance data
  async getUserPerformance(username: string, days: number = 30): Promise<any[]> {
    try {
      return await serverApi.getUserPerformance(username, days);
    } catch (error) {
      console.error('Failed to get user performance:', error);
      return [];
    }
  }

  // Get user games
  async getUserGames(
    username: string,
    options?: {
      date?: string;
      challengeId?: string;
    }
  ): Promise<GameResult[]> {
    try {
      return await serverApi.getUserGames(username, options);
    } catch (error) {
      console.error('Failed to get user games:', error);
      return [];
    }
  }

  // Get user rank
  async getUserRank(username: string): Promise<{
    dailyRank: number;
    allTimeRank: number;
    weeklyRank: number;
    monthlyRank: number;
  }> {
    try {
      return await serverApi.getUserLeaderboardPosition(username);
    } catch (error) {
      console.error('Failed to get user rank:', error);
      return {
        dailyRank: -1,
        allTimeRank: -1,
        weeklyRank: -1,
        monthlyRank: -1,
      };
    }
  }

  // Update gems locally (for immediate UI updates)
  updateGemsLocally(amount: number): void {
    this.gems = Math.max(0, this.gems + amount);
  }

  // Force sync
  async forceSync(): Promise<void> {
    if (this.currentUser) {
      await this.syncUserData(this.currentUser);
    }
  }

  // Check if data is stale
  isDataStale(): boolean {
    return Date.now() - this.lastSync > this.syncInterval;
  }

  // Get last sync time
  getLastSyncTime(): number {
    return this.lastSync;
  }

  // Clear data (for logout)
  clearData(): void {
    this.currentUser = null;
    this.userData = null;
    this.gems = 0;
    this.stats = null;
    this.lastSync = 0;
  }
}

// Export singleton instance
export const dataSync = DataSyncService.getInstance();
