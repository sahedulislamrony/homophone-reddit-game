import { RedisService } from './RedisService';
import { UserData, UserStats, GameTransaction } from '@shared/types/server';
import { isAdmin } from '../config/admins';

export class UserService {
  private redis: RedisService;

  constructor(redis: RedisService) {
    this.redis = redis;
  }

  // User management
  async createUser(username: string): Promise<UserData> {
    if (await this.redis.isUserExists(username)) {
      throw new Error('User already exists');
    }

    const role = isAdmin(username) ? 'admin' : 'player';
    return await this.redis.createUser(username, role);
  }

  async getUserData(username: string): Promise<UserData | null> {
    return await this.redis.getUserData(username);
  }

  async getUserOrCreate(username: string): Promise<UserData> {
    let userData = await this.redis.getUserData(username);

    if (!userData) {
      userData = await this.createUser(username);
    }

    return userData;
  }

  // Gem management
  async addGems(
    username: string,
    amount: number,
    reason: string,
    gameId?: string
  ): Promise<number> {
    const newGems = await this.redis.addUserGems(username, amount);

    // Log transaction
    await this.redis.logTransaction({
      id: `gem_earned_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username,
      type: 'gem_earned',
      amount,
      reason,
      gameId: gameId || '',
      timestamp: new Date().toISOString(),
    });

    return newGems;
  }

  async spendGems(
    username: string,
    amount: number,
    reason: string,
    gameId?: string
  ): Promise<boolean> {
    const success = await this.redis.spendUserGems(username, amount);

    if (success) {
      // Log transaction
      await this.redis.logTransaction({
        id: `gem_spent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        username,
        type: 'gem_spent',
        amount,
        reason,
        gameId: gameId || '',
        timestamp: new Date().toISOString(),
      });
    }

    return success;
  }

  async getGems(username: string): Promise<number> {
    return await this.redis.getUserGems(username);
  }

  // Points management
  async addPoints(
    username: string,
    points: number,
    reason: string,
    isDaily: boolean = false,
    gameId?: string
  ): Promise<void> {
    await this.redis.updateUserPoints(username, points, isDaily);

    // Update leaderboard
    await this.redis.updateLeaderboard(username, points, isDaily);

    // Log transaction
    await this.redis.logTransaction({
      id: `points_earned_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username,
      type: 'points_earned',
      amount: points,
      reason,
      gameId: gameId || '',
      timestamp: new Date().toISOString(),
    });
  }

  // Streak management
  async updateStreak(username: string, streak: number): Promise<void> {
    await this.redis.updateUserStreak(username, streak);
  }

  // Stats management
  async getUserStats(username: string): Promise<UserStats | null> {
    return await this.redis.getUserStats(username);
  }

  async getUserTransactions(username: string, limit: number = 50): Promise<GameTransaction[]> {
    return await this.redis.getUserTransactions(username, limit);
  }

  // Game-related operations
  async canPlayChallenge(username: string, challengeId: string, date: string): Promise<boolean> {
    const userGames = await this.redis.getUserGamesByDate(username, date);
    return !userGames.some((game) => game.challengeId === challengeId);
  }

  // Admin operations
  async getAllUsers(): Promise<UserData[]> {
    // This would need to be implemented with a different approach
    // For now, we'll return an empty array
    // In a real implementation, you'd maintain a set of all usernames
    return [];
  }

  async getUserRank(username: string, isDaily: boolean = false): Promise<number> {
    return await this.redis.getUserRank(username, isDaily);
  }

  // Data synchronization
  async syncUserData(username: string): Promise<{
    userData: UserData;
    stats: UserStats | null;
    transactions: GameTransaction[];
    gems: number;
  }> {
    const userData = await this.getUserOrCreate(username);
    const stats = await this.getUserStats(username);
    const transactions = await this.getUserTransactions(username, 20);
    const gems = await this.getGems(username);

    return {
      userData,
      stats,
      transactions,
      gems,
    };
  }
}
