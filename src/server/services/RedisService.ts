import { redis } from '@devvit/web/server';
import {
  UserData,
  GameResult,
  LeaderboardEntry,
  UserStats,
  GameTransaction,
  REDIS_KEYS,
} from '@shared/types/server';
import { getServerDate, getServerTime } from '../utils/timeUtils';

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
      createdAt: getServerTime(),
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
      userData.lastPlayedDate = getServerDate();
      await this.setUserData(userData);
    }
  }

  // Game result operations
  async saveGameResult(gameResult: GameResult): Promise<void> {
    console.log(
      `Saving game result: ${gameResult.id} for user: ${gameResult.username} with score: ${gameResult.score}`
    );
    await redis.set(REDIS_KEYS.GAME_RESULT(gameResult.id), JSON.stringify(gameResult));

    // Add to user's game list using a hash for better performance
    const userGamesKey = REDIS_KEYS.USER_GAMES(gameResult.username);
    const keyExists = await redis.exists(userGamesKey);

    if (keyExists === 0) {
      // Key doesn't exist, create as hash
      await redis.hSet(userGamesKey, {
        [gameResult.id]: gameResult.completedAt,
      });
    } else {
      // Key exists, check its type
      const keyType = await redis.type(userGamesKey);
      if (keyType === 'hash') {
        // It's already a hash, add to it
        await redis.hSet(userGamesKey, {
          [gameResult.id]: gameResult.completedAt,
        });
      } else {
        // It's not a hash, delete and recreate as hash
        console.log(`Converting USER_GAMES key from ${keyType} to hash for ${gameResult.username}`);
        await redis.del(userGamesKey);
        await redis.hSet(userGamesKey, {
          [gameResult.id]: gameResult.completedAt,
        });
      }
    }

    // Update daily points (accumulate if user has played before today)
    const dailyPointsKey = REDIS_KEYS.DAILY_POINTS(gameResult.username, gameResult.date);
    const existingDailyPoints = await redis.get(dailyPointsKey);
    const currentDailyPoints = existingDailyPoints ? parseInt(existingDailyPoints) : 0;
    const newDailyPoints = currentDailyPoints + gameResult.score;
    await redis.set(dailyPointsKey, newDailyPoints.toString());

    // Update daily leaderboard with accumulated daily points
    const dailyKey = REDIS_KEYS.DAILY_LEADERBOARD(gameResult.date);
    console.log(`Updating daily leaderboard: ${dailyKey} with ${newDailyPoints} points`);
    const dailyKeyExists = await redis.exists(dailyKey);
    if (dailyKeyExists === 0) {
      // Create new sorted set
      await redis.zAdd(dailyKey, {
        member: gameResult.username,
        score: newDailyPoints,
      });
    } else {
      // Check if it's a sorted set
      const dailyKeyType = await redis.type(dailyKey);
      if (dailyKeyType === 'zset') {
        // Use zAdd to replace the score (not add to it)
        await redis.zAdd(dailyKey, {
          member: gameResult.username,
          score: newDailyPoints,
        });
      } else {
        console.log(
          `Converting daily leaderboard key from ${dailyKeyType} to zset for ${gameResult.date}`
        );
        await redis.del(dailyKey);
        await redis.zAdd(dailyKey, {
          member: gameResult.username,
          score: newDailyPoints,
        });
      }
    }

    // Update all-time leaderboard
    const allTimeKey = REDIS_KEYS.ALL_TIME_LEADERBOARD;
    console.log(`Updating all-time leaderboard: ${allTimeKey}`);
    const allTimeKeyExists = await redis.exists(allTimeKey);
    if (allTimeKeyExists === 0) {
      // Create new sorted set
      await redis.zAdd(allTimeKey, {
        member: gameResult.username,
        score: gameResult.score,
      });
    } else {
      // Check if it's a sorted set
      const allTimeKeyType = await redis.type(allTimeKey);
      if (allTimeKeyType === 'zset') {
        await redis.zAdd(allTimeKey, {
          member: gameResult.username,
          score: gameResult.score,
        });
      } else {
        console.log(`Converting all-time leaderboard key from ${allTimeKeyType} to zset`);
        await redis.del(allTimeKey);
        await redis.zAdd(allTimeKey, {
          member: gameResult.username,
          score: gameResult.score,
        });
      }
    }

    // Update user's total points and stats
    await this.updateUserPoints(gameResult.username, gameResult.score, true);

    // Update user's gems (earned - spent)
    const gemChange = gameResult.gemsEarned - gameResult.gemsSpent;
    if (gemChange > 0) {
      await this.addUserGems(gameResult.username, gemChange);
    } else if (gemChange < 0) {
      await this.spendUserGems(gameResult.username, Math.abs(gemChange));
    }

    // Update user's detailed stats
    await this.updateUserStats(gameResult.username, gameResult);
  }

  async getGameResult(gameId: string): Promise<GameResult | null> {
    console.log(`Getting game result for ID: ${gameId}`);
    const data = await redis.get(REDIS_KEYS.GAME_RESULT(gameId));
    console.log(`Game result data: ${data ? 'found' : 'not found'}`);
    return data ? JSON.parse(data) : null;
  }

  async getGameResultByChallengeId(
    username: string,
    challengeId: string
  ): Promise<GameResult | null> {
    console.log(`Getting game result for user: ${username}, challenge: ${challengeId}`);

    try {
      // Get all user games
      const userGames = await this.getUserGames(username);
      console.log(`User games count: ${userGames.length}`);

      // Find the game result with matching challengeId
      const gameResult = userGames.find((game) => game.challengeId === challengeId);
      console.log(`Found game result: ${gameResult ? 'yes' : 'no'}`);

      return gameResult || null;
    } catch (error) {
      console.error('Error getting game result by challenge ID:', error);
      return null;
    }
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
    const date = getServerDate();

    if (isDaily) {
      // For daily leaderboard, get the current daily points and update with that
      const dailyPointsKey = REDIS_KEYS.DAILY_POINTS(username, date);
      const currentDailyPoints = await redis.get(dailyPointsKey);
      const dailyPoints = currentDailyPoints ? parseInt(currentDailyPoints) : 0;

      await redis.zAdd(REDIS_KEYS.DAILY_LEADERBOARD(date), {
        member: username,
        score: dailyPoints,
      });
    }

    // Always update all-time leaderboard (this should accumulate)
    await redis.zAdd(REDIS_KEYS.ALL_TIME_LEADERBOARD, { member: username, score: points });
  }

  async getDailyLeaderboard(date: string, limit: number = 100): Promise<LeaderboardEntry[]> {
    try {
      const key = REDIS_KEYS.DAILY_LEADERBOARD(date);
      console.log(`Getting daily leaderboard for date: ${date}, key: ${key}`);

      // Check if the key exists and is a sorted set
      const keyExists = await redis.exists(key);
      console.log(`Key exists: ${keyExists}`);
      if (keyExists === 0) {
        console.log(`No daily leaderboard data found for date: ${date}`);
        return [];
      }

      const keyType = await redis.type(key);
      if (keyType !== 'zset') {
        console.warn(`Expected sorted set for daily leaderboard, got '${keyType}' for key: ${key}`);
        return [];
      }

      const totalCount = await redis.zCard(key);
      if (totalCount === 0) return [];

      // Get entries in descending order by score
      const entries = await redis.zRange(key, 0, limit - 1, {
        by: 'score',
      });
      // Reverse to get descending order since zRange returns ascending by default
      entries.reverse();
      const leaderboard: LeaderboardEntry[] = [];

      console.log(`Found ${entries.length} entries in daily leaderboard for ${date}:`);
      entries.forEach((entry, index) => {
        console.log(`  ${index + 1}. ${entry.member}: ${entry.score} points`);
      });

      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
        if (!entry) continue;

        const username = entry.member;
        const points = entry.score;

        if (username) {
          try {
            console.log(`Getting user data for leaderboard entry: ${username}`);
            const userData = await this.getUserData(username);
            const userGames = await this.getUserGames(username);

            console.log(`User data for ${username}:`, userData);
            console.log(`User games for ${username}:`, userGames.length);

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
      console.log(`Getting all-time leaderboard, key: ${key}`);

      // Check if the key exists and is a sorted set
      const keyExists = await redis.exists(key);
      console.log(`All-time leaderboard key exists: ${keyExists}`);
      if (keyExists === 0) {
        console.log('No all-time leaderboard data found');
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

      // Get entries in descending order by score
      const entries = await redis.zRange(key, 0, limit - 1, {
        by: 'score',
      });
      // Reverse to get descending order since zRange returns ascending by default
      entries.reverse();
      const leaderboard: LeaderboardEntry[] = [];

      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
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

    // Also update user's lastPlayedDate in user data
    const userData = await this.getUserData(username);
    if (userData) {
      userData.lastPlayedDate = gameResult.date;
      await this.setUserData(userData);
    }
  }

  // Get historical daily leaderboard data
  async getHistoricalDailyLeaderboards(
    startDate: string,
    endDate: string
  ): Promise<{ [date: string]: LeaderboardEntry[] }> {
    try {
      const results: { [date: string]: LeaderboardEntry[] } = {};

      // Generate date range
      const start = new Date(startDate);
      const end = new Date(endDate);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        if (dateStr) {
          const leaderboard = await this.getDailyLeaderboard(dateStr, 100);
          if (leaderboard.length > 0) {
            results[dateStr] = leaderboard;
          }
        }
      }

      return results;
    } catch (error) {
      console.error('Error getting historical daily leaderboards:', error);
      return {};
    }
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
      createdAt: getServerTime(),
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
    const date = getServerDate();
    const key = isDaily ? REDIS_KEYS.DAILY_LEADERBOARD(date) : REDIS_KEYS.ALL_TIME_LEADERBOARD;
    const rank = await redis.zRank(key, username);
    return rank !== null && rank !== undefined ? rank + 1 : 0;
  }

  async getUserPoints(username: string, isDaily: boolean = false): Promise<number> {
    const date = getServerDate();
    const key = isDaily ? REDIS_KEYS.DAILY_LEADERBOARD(date) : REDIS_KEYS.ALL_TIME_LEADERBOARD;
    const score = await redis.zScore(key, username);
    return score !== null && score !== undefined ? Math.round(score) : 0;
  }

  // Initialize app for new installations (no dummy data)
  async initializeSampleData(): Promise<void> {
    try {
      // Just log that the app is ready for new users
      console.log('App initialized successfully - New users will start with 10 gems');

      // Add some test data for leaderboard
      const today = getServerDate();
      console.log('Adding test leaderboard data for date:', today);

      // Add test entries to daily leaderboard
      await redis.zAdd(REDIS_KEYS.DAILY_LEADERBOARD(today), {
        member: 'testuser1',
        score: 150,
      });
      await redis.zAdd(REDIS_KEYS.DAILY_LEADERBOARD(today), {
        member: 'testuser2',
        score: 200,
      });
      await redis.zAdd(REDIS_KEYS.DAILY_LEADERBOARD(today), {
        member: 'testuser3',
        score: 100,
      });

      // Add test entries to all-time leaderboard
      await redis.zAdd(REDIS_KEYS.ALL_TIME_LEADERBOARD, {
        member: 'testuser1',
        score: 150,
      });
      await redis.zAdd(REDIS_KEYS.ALL_TIME_LEADERBOARD, {
        member: 'testuser2',
        score: 200,
      });
      await redis.zAdd(REDIS_KEYS.ALL_TIME_LEADERBOARD, {
        member: 'testuser3',
        score: 100,
      });

      console.log('Test leaderboard data added successfully');
    } catch (error) {
      console.error('Error initializing app:', error);
    }
  }

  // Note: No close method needed as Redis is managed by Devvit
}
