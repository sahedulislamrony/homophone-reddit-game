import { RedisService } from './RedisService';
import { UserService } from './UserService';
import { GameResult, UserData } from '@shared/types/server';
import { v4 as uuidv4 } from 'uuid';

export class GameService {
  private redis: RedisService;
  private userService: UserService;

  constructor(redis: RedisService, userService: UserService) {
    this.redis = redis;
    this.userService = userService;
  }

  // Game result management
  async saveGameResult(
    username: string,
    challengeId: string,
    gameData: {
      score: number;
      hintsUsed: number;
      freeHintsUsed: number;
      gemsSpent: number;
      timeSpent: number;
      difficulty: 'easy' | 'medium' | 'hard';
      themeName: string;
    }
  ): Promise<GameResult> {
    const gameId = uuidv4();
    const date = new Date().toISOString().split('T')[0];

    // Calculate gems earned (first time bonuses)
    const gemsEarned = await this.userService.getFirstTimeBonus(username, challengeId, date);

    // Create game result
    const gameResult: GameResult = {
      id: gameId,
      username,
      challengeId,
      date,
      score: gameData.score,
      hintsUsed: gameData.hintsUsed,
      freeHintsUsed: gameData.freeHintsUsed,
      gemsSpent: gameData.gemsSpent,
      gemsEarned,
      completedAt: new Date().toISOString(),
      timeSpent: gameData.timeSpent,
      difficulty: gameData.difficulty,
      themeName: gameData.themeName,
    };

    // Save game result
    await this.redis.saveGameResult(gameResult);

    // Update user stats
    await this.redis.updateUserStats(username, gameResult);

    // Add points to user
    await this.userService.addPoints(
      username,
      gameData.score,
      `Game completed: ${gameData.themeName}`,
      true, // Daily points
      gameId
    );

    // Add gems if earned
    if (gemsEarned > 0) {
      await this.userService.addGems(
        username,
        gemsEarned,
        `First time bonus: ${gameData.themeName}`,
        gameId
      );
    }

    // Deduct gems if spent
    if (gameData.gemsSpent > 0) {
      await this.userService.spendGems(
        username,
        gameData.gemsSpent,
        `Hints used in: ${gameData.themeName}`,
        gameId
      );
    }

    return gameResult;
  }

  async getGameResult(gameId: string): Promise<GameResult | null> {
    return await this.redis.getGameResult(gameId);
  }

  async getGameResultByChallengeId(
    username: string,
    challengeId: string
  ): Promise<GameResult | null> {
    return await this.redis.getGameResultByChallengeId(username, challengeId);
  }

  async getUserGames(username: string): Promise<GameResult[]> {
    return await this.redis.getUserGames(username);
  }

  async getUserGamesByDate(username: string, date: string): Promise<GameResult[]> {
    return await this.redis.getUserGamesByDate(username, date);
  }

  async getUserGamesByChallenge(username: string, challengeId: string): Promise<GameResult[]> {
    const allGames = await this.redis.getUserGames(username);
    return allGames.filter((game) => game.challengeId === challengeId);
  }

  // Game validation
  async canPlayGame(
    username: string,
    challengeId: string
  ): Promise<{
    canPlay: boolean;
    reason?: string;
    gemsAvailable: number;
  }> {
    const userData = await this.userService.getUserData(username);
    if (!userData) {
      return {
        canPlay: false,
        reason: 'User not found',
        gemsAvailable: 0,
      };
    }

    const date = new Date().toISOString().split('T')[0];
    const hasPlayedToday = await this.redis.getUserGamesByDate(username, date);
    const hasPlayedThisChallenge = hasPlayedToday.some((game) => game.challengeId === challengeId);

    // Check if user has already played this challenge today
    if (hasPlayedThisChallenge) {
      return {
        canPlay: false,
        reason: 'Already played this challenge today',
        gemsAvailable: userData.gems,
      };
    }

    return {
      canPlay: true,
      gemsAvailable: userData.gems,
    };
  }

  // Game statistics
  async getGameStats(username: string): Promise<{
    totalGames: number;
    totalPoints: number;
    dailyPoints: number;
    averageScore: number;
    bestScore: number;
    totalHintsUsed: number;
    totalGemsEarned: number;
    totalGemsSpent: number;
    gamesByDifficulty: { easy: number; medium: number; hard: number };
    gamesByTheme: { [theme: string]: number };
    currentStreak: number;
    bestStreak: number;
  }> {
    const stats = await this.redis.getUserStats(username);
    const userData = await this.userService.getUserData(username);

    if (!stats || !userData) {
      return {
        totalGames: 0,
        totalPoints: 0,
        dailyPoints: 0,
        averageScore: 0,
        bestScore: 0,
        totalHintsUsed: 0,
        totalGemsEarned: 0,
        totalGemsSpent: 0,
        gamesByDifficulty: { easy: 0, medium: 0, hard: 0 },
        gamesByTheme: {},
        currentStreak: 0,
        bestStreak: 0,
      };
    }

    // Get best score from all games
    const allGames = await this.redis.getUserGames(username);
    const bestScore = allGames.length > 0 ? Math.max(...allGames.map((g) => g.score)) : 0;

    return {
      totalGames: stats.totalGames,
      totalPoints: stats.totalPoints,
      dailyPoints: userData.dailyPoints,
      averageScore: stats.averageScore,
      bestScore,
      totalHintsUsed: stats.totalHintsUsed,
      totalGemsEarned: stats.totalGemsEarned,
      totalGemsSpent: stats.totalGemsSpent,
      gamesByDifficulty: stats.gamesByDifficulty,
      gamesByTheme: stats.gamesByTheme,
      currentStreak: stats.currentStreak,
      bestStreak: stats.bestStreak,
    };
  }

  // Challenge-specific operations
  async getChallengeHistory(username: string, challengeId: string): Promise<GameResult[]> {
    return await this.getUserGamesByChallenge(username, challengeId);
  }

  async getTodayGames(username: string): Promise<GameResult[]> {
    const date = new Date().toISOString().split('T')[0];
    return await this.getUserGamesByDate(username, date);
  }

  // Performance analytics
  async getPerformanceData(
    username: string,
    days: number = 30
  ): Promise<
    {
      date: string;
      gamesPlayed: number;
      totalScore: number;
      averageScore: number;
      hintsUsed: number;
      gemsEarned: number;
      gemsSpent: number;
    }[]
  > {
    const allGames = await this.redis.getUserGames(username);
    const performanceData: { [date: string]: any } = {};

    // Initialize last 30 days
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      performanceData[dateStr] = {
        date: dateStr,
        gamesPlayed: 0,
        totalScore: 0,
        averageScore: 0,
        hintsUsed: 0,
        gemsEarned: 0,
        gemsSpent: 0,
      };
    }

    // Process games
    allGames.forEach((game) => {
      if (performanceData[game.date]) {
        performanceData[game.date].gamesPlayed++;
        performanceData[game.date].totalScore += game.score;
        performanceData[game.date].hintsUsed += game.hintsUsed;
        performanceData[game.date].gemsEarned += game.gemsEarned;
        performanceData[game.date].gemsSpent += game.gemsSpent;
      }
    });

    // Calculate averages
    Object.values(performanceData).forEach((day: any) => {
      if (day.gamesPlayed > 0) {
        day.averageScore = day.totalScore / day.gamesPlayed;
      }
    });

    return Object.values(performanceData).sort(
      (a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }
}
