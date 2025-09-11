import { redis } from '@devvit/web/server';
import {
  UserData,
  GameResult,
  LeaderboardEntry,
  UserStats,
  GameTransaction,
  REDIS_KEYS,
} from '@shared/types/server';

export class RedisService {
  constructor() {
    // Redis is provided by Devvit Web server
  }

  // User data operations
  async getUserData(username: string): Promise<UserData | null> {
    const data = await redis.get(REDIS_KEYS.USER(username));
    return data ? JSON.parse(data) : null;
  }

  async setUserData(userData: UserData): Promise<void> {
    await redis.set(REDIS_KEYS.USER(userData.username), JSON.stringify(userData));
  }

  async createUser(username: string, role: 'player' | 'admin' = 'player'): Promise<UserData> {
    const userData: UserData = {
      username,
      role,
      gems: 10, // Starting gems
      totalPoints: 0,
      dailyPoints: 0,
      currentStreak: 0,
      lastPlayedDate: '',
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    await this.setUserData(userData);
    return userData;
  }

  async updateUserGems(username: string, gems: number): Promise<void> {
    await redis.set(REDIS_KEYS.USER_GEMS(username), gems.toString());
    // Also update in main user data
    const userData = await this.getUserData(username);
    if (userData) {
      userData.gems = gems;
      await this.setUserData(userData);
    }
  }

  async addUserGems(username: string, amount: number): Promise<number> {
    const currentGems = await this.getUserGems(username);
    const newGems = currentGems + amount;
    await this.updateUserGems(username, newGems);
    return newGems;
  }

  async spendUserGems(username: string, amount: number): Promise<boolean> {
    const currentGems = await this.getUserGems(username);
    if (currentGems >= amount) {
      await this.updateUserGems(username, currentGems - amount);
      return true;
    }
    return false;
  }

  async getUserGems(username: string): Promise<number> {
    const gems = await redis.get(REDIS_KEYS.USER_GEMS(username));
    return gems ? parseInt(gems) : 0;
  }

  async updateUserPoints(
    username: string,
    points: number,
    isDaily: boolean = false
  ): Promise<void> {
    const userData = await this.getUserData(username);
    if (userData) {
      userData.totalPoints += points;
      if (isDaily) {
        userData.dailyPoints += points;
      }
      await this.setUserData(userData);
    }
  }

  async updateUserStreak(username: string, streak: number): Promise<void> {
    const userData = await this.getUserData(username);
    if (userData) {
      userData.currentStreak = streak;
      userData.lastPlayedDate = new Date().toISOString().split('T')[0] || '';
      await this.setUserData(userData);
    }
  }

  // Game result operations
  async saveGameResult(gameResult: GameResult): Promise<void> {
    await redis.set(REDIS_KEYS.GAME_RESULT(gameResult.id), JSON.stringify(gameResult));

    // Add to user's game list using a hash for better performance
    await redis.hSet(REDIS_KEYS.USER_GAMES(gameResult.username), {
      [gameResult.id]: gameResult.completedAt,
    });

    // Update daily points
    await redis.set(
      REDIS_KEYS.DAILY_POINTS(gameResult.username, gameResult.date),
      gameResult.score.toString()
    );
  }

  async getGameResult(gameId: string): Promise<GameResult | null> {
    const data = await redis.get(REDIS_KEYS.GAME_RESULT(gameId));
    return data ? JSON.parse(data) : null;
  }

  async getUserGames(username: string): Promise<GameResult[]> {
    try {
      const key = REDIS_KEYS.USER_GAMES(username);

      // Check if the key exists first
      const keyExists = await redis.exists(key);
      if (keyExists === 0) {
        return [];
      }

      // Check the type of the key
      const keyType = await redis.type(key);

      let gameIds: string[] = [];

      if (keyType === 'hash') {
        gameIds = await redis.hKeys(key);
      } else if (keyType === 'string') {
        // If it's a string, try to parse it as JSON array
        const data = await redis.get(key);
        if (data) {
          try {
            gameIds = JSON.parse(data);
          } catch {
            console.warn(`Failed to parse user games data for ${username}`);
            gameIds = [];
          }
        }
      } else {
        console.warn(`Unexpected Redis key type '${keyType}' for user games: ${key}`);
        return [];
      }

      const games: GameResult[] = [];

      for (const gameId of gameIds) {
        try {
          const game = await this.getGameResult(gameId);
          if (game) {
            games.push(game);
          }
        } catch (gameError) {
          console.warn(`Failed to get game result for ${gameId}:`, gameError);
        }
      }

      return games.sort(
        (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      );
    } catch (error) {
      console.error('Error getting user games:', error);
      return [];
    }
  }

  async getUserGamesByDate(username: string, date: string): Promise<GameResult[]> {
    const allGames = await this.getUserGames(username);
    return allGames.filter((game) => game.date === date);
  }

  // Leaderboard operations
  async updateLeaderboard(
    username: string,
    points: number,
    isDaily: boolean = false
  ): Promise<void> {
    const date = new Date().toISOString().split('T')[0] || '';

    if (isDaily) {
      await redis.zAdd(REDIS_KEYS.DAILY_LEADERBOARD(date), { member: username, score: points });
    }

    // Always update all-time leaderboard
    await redis.zAdd(REDIS_KEYS.ALL_TIME_LEADERBOARD, { member: username, score: points });
  }

  async getDailyLeaderboard(date: string, limit: number = 100): Promise<LeaderboardEntry[]> {
    try {
      const key = REDIS_KEYS.DAILY_LEADERBOARD(date);

      // Check if the key exists and is a sorted set
      const keyExists = await redis.exists(key);
      if (keyExists === 0) {
        return [];
      }

      const keyType = await redis.type(key);
      if (keyType !== 'zset') {
        console.warn(`Expected sorted set for daily leaderboard, got '${keyType}' for key: ${key}`);
        return [];
      }

      const totalCount = await redis.zCard(key);
      if (totalCount === 0) return [];

      // Calculate reverse range for descending order
      const start = Math.max(0, totalCount - limit);
      const end = totalCount - 1;

      const entries = await redis.zRange(key, start, end, {
        by: 'rank',
      });
      const leaderboard: LeaderboardEntry[] = [];

      // Reverse the entries to get descending order
      const reversedEntries = entries.reverse();

      for (let i = 0; i < reversedEntries.length; i++) {
        const entry = reversedEntries[i];
        if (!entry) continue;

        const username = entry.member;
        const points = entry.score;

        if (username) {
          try {
            const userData = await this.getUserData(username);
            const userGames = await this.getUserGames(username);

            leaderboard.push({
              rank: i + 1,
              username,
              totalPoints: userData?.totalPoints || 0,
              dailyPoints: points,
              currentStreak: userData?.currentStreak || 0,
              gamesPlayed: userGames.length,
              lastPlayedDate: userData?.lastPlayedDate || '',
            });
          } catch (userError) {
            console.warn(`Failed to get user data for ${username}:`, userError);
            // Add entry with minimal data
            leaderboard.push({
              rank: i + 1,
              username,
              totalPoints: points,
              dailyPoints: points,
              currentStreak: 0,
              gamesPlayed: 0,
              lastPlayedDate: '',
            });
          }
        }
      }

      return leaderboard;
    } catch (error) {
      console.error('Error getting daily leaderboard:', error);
      return [];
    }
  }

  async getAllTimeLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
    try {
      const key = REDIS_KEYS.ALL_TIME_LEADERBOARD;

      // Check if the key exists and is a sorted set
      const keyExists = await redis.exists(key);
      if (keyExists === 0) {
        return [];
      }

      const keyType = await redis.type(key);
      if (keyType !== 'zset') {
        console.warn(
          `Expected sorted set for all-time leaderboard, got '${keyType}' for key: ${key}`
        );
        return [];
      }

      const totalCount = await redis.zCard(key);
      if (totalCount === 0) return [];

      // Calculate reverse range for descending order
      const start = Math.max(0, totalCount - limit);
      const end = totalCount - 1;

      const entries = await redis.zRange(key, start, end, { by: 'rank' });
      const leaderboard: LeaderboardEntry[] = [];

      // Reverse the entries to get descending order
      const reversedEntries = entries.reverse();

      for (let i = 0; i < reversedEntries.length; i++) {
        const entry = reversedEntries[i];
        if (!entry) continue;

        const username = entry.member;
        const points = entry.score;

        if (username) {
          try {
            const userData = await this.getUserData(username);
            const userGames = await this.getUserGames(username);

            leaderboard.push({
              rank: i + 1,
              username,
              totalPoints: points,
              dailyPoints: userData?.dailyPoints || 0,
              currentStreak: userData?.currentStreak || 0,
              gamesPlayed: userGames.length,
              lastPlayedDate: userData?.lastPlayedDate || '',
            });
          } catch (userError) {
            console.warn(`Failed to get user data for ${username}:`, userError);
            // Add entry with minimal data
            leaderboard.push({
              rank: i + 1,
              username,
              totalPoints: points,
              dailyPoints: 0,
              currentStreak: 0,
              gamesPlayed: 0,
              lastPlayedDate: '',
            });
          }
        }
      }

      return leaderboard;
    } catch (error) {
      console.error('Error getting all-time leaderboard:', error);
      return [];
    }
  }

  // User stats operations
  async getUserStats(username: string): Promise<UserStats | null> {
    try {
      const stats = await redis.get(REDIS_KEYS.USER_STATS(username));
      if (!stats) return null;

      return JSON.parse(stats);
    } catch (error) {
      console.error(`Error getting user stats for ${username}:`, error);
      return null;
    }
  }

  async updateUserStats(username: string, gameResult: GameResult): Promise<void> {
    let stats = await this.getUserStats(username);

    if (!stats) {
      stats = {
        username,
        totalGames: 0,
        totalPoints: 0,
        dailyPoints: 0,
        currentStreak: 0,
        bestStreak: 0,
        averageScore: 0,
        totalHintsUsed: 0,
        totalGemsEarned: 0,
        totalGemsSpent: 0,
        favoriteTheme: '',
        lastPlayedDate: '',
        gamesByDifficulty: { easy: 0, medium: 0, hard: 0 },
        gamesByTheme: {},
      };
    }

    // Update stats
    stats.totalGames++;
    stats.totalPoints += gameResult.score;
    stats.totalHintsUsed += gameResult.hintsUsed;
    stats.totalGemsEarned += gameResult.gemsEarned;
    stats.totalGemsSpent += gameResult.gemsSpent;
    stats.averageScore = stats.totalPoints / stats.totalGames;
    stats.lastPlayedDate = gameResult.date;

    // Update difficulty stats
    stats.gamesByDifficulty[gameResult.difficulty]++;

    // Update theme stats
    stats.gamesByTheme[gameResult.themeName] = (stats.gamesByTheme[gameResult.themeName] || 0) + 1;

    // Find favorite theme
    stats.favoriteTheme =
      Object.entries(stats.gamesByTheme).sort(([, a], [, b]) => b - a)[0]?.[0] || '';

    await redis.set(REDIS_KEYS.USER_STATS(username), JSON.stringify(stats));
  }

  // Transaction logging
  async logTransaction(transaction: GameTransaction): Promise<void> {
    try {
      // Store transaction as a separate key for better performance
      await redis.set(
        REDIS_KEYS.TRANSACTIONS(transaction.username) + ':' + transaction.id,
        JSON.stringify(transaction)
      );

      // Add transaction ID to a hash for the user (using timestamp as score for ordering)
      await redis.hSet(REDIS_KEYS.TRANSACTIONS(transaction.username) + ':list', {
        [transaction.id]: transaction.timestamp,
      });

      // Keep only last 1000 transactions per user by checking hash length
      const allTransactions = await redis.hKeys(
        REDIS_KEYS.TRANSACTIONS(transaction.username) + ':list'
      );
      if (allTransactions.length > 1000) {
        // Get oldest transactions and remove them
        const sortedTransactions = allTransactions
          .map((id) => ({ id, timestamp: id.split('_')[1] || '0' }))
          .sort((a, b) => parseInt(a.timestamp) - parseInt(b.timestamp));

        const toRemove = sortedTransactions.slice(0, allTransactions.length - 1000);
        for (const tx of toRemove) {
          await redis.hDel(REDIS_KEYS.TRANSACTIONS(transaction.username) + ':list', [tx.id]);
        }
      }
    } catch (error) {
      console.error('Error logging transaction:', error);
    }
  }

  async getUserTransactions(username: string, limit: number = 50): Promise<GameTransaction[]> {
    try {
      const transactionIds = await redis.hKeys(REDIS_KEYS.TRANSACTIONS(username) + ':list');
      const transactions: GameTransaction[] = [];

      for (const id of transactionIds) {
        const transactionData = await redis.get(REDIS_KEYS.TRANSACTIONS(username) + ':' + id);
        if (transactionData) {
          transactions.push(JSON.parse(transactionData));
        }
      }

      return transactions
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, limit);
    } catch (error) {
      console.error('Error getting user transactions:', error);
      return [];
    }
  }

  // Create new user with 10 gems
  async createNewUser(username: string): Promise<UserData> {
    const newUser: UserData = {
      username,
      role: 'player',
      gems: 10, // New users start with 10 gems
      totalPoints: 0,
      dailyPoints: 0,
      currentStreak: 0,
      lastPlayedDate: '',
      createdAt: new Date().toISOString(),
      isActive: true,
    };

    await this.setUserData(newUser);

    // Create initial stats for new user
    const initialStats: UserStats = {
      username,
      totalGames: 0,
      totalPoints: 0,
      dailyPoints: 0,
      currentStreak: 0,
      bestStreak: 0,
      averageScore: 0,
      totalHintsUsed: 0,
      totalGemsEarned: 0,
      totalGemsSpent: 0,
      favoriteTheme: '',
      lastPlayedDate: '',
      gamesByDifficulty: { easy: 0, medium: 0, hard: 0 },
      gamesByTheme: {},
    };

    await redis.set(REDIS_KEYS.USER_STATS(username), JSON.stringify(initialStats));

    console.log(`New user ${username} created with 10 gems`);
    return newUser;
  }

  // Utility methods
  async isUserExists(username: string): Promise<boolean> {
    return (await redis.exists(REDIS_KEYS.USER(username))) === 1;
  }

  async getUserRank(username: string, isDaily: boolean = false): Promise<number> {
    const date =
      new Date().toISOString().split('T')[0] || new Date().toISOString().substring(0, 10);
    const key = isDaily ? REDIS_KEYS.DAILY_LEADERBOARD(date) : REDIS_KEYS.ALL_TIME_LEADERBOARD;
    const rank = await redis.zRank(key, username);
    return rank !== null && rank !== undefined ? rank + 1 : -1;
  }

  // Initialize app for new installations (no dummy data)
  async initializeSampleData(): Promise<void> {
    try {
      // Just log that the app is ready for new users
      console.log('App initialized successfully - New users will start with 10 gems');
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }

  // Note: No close method needed as Redis is managed by Devvit
}
