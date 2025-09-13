import { RedisService } from './RedisService';
import {
  getServerDate,
  getServerTime,
  getServerDateObject,
  formatToDateString,
} from '../utils/timeUtils';
import { LeaderboardEntry, DailyLeaderboard } from '@shared/types/server';

export class LeaderboardService {
  private redis: RedisService;

  constructor(redis: RedisService) {
    this.redis = redis;
  }

  // Daily leaderboard
  async getDailyLeaderboard(date?: string, limit: number = 100): Promise<DailyLeaderboard> {
    const targetDate = date || getServerDate();
    const entries = await this.redis.getDailyLeaderboard(targetDate, limit);

    return {
      date: targetDate,
      entries,
      totalPlayers: entries.length,
      lastUpdated: getServerTime(),
    };
  }

  // All-time leaderboard
  async getAllTimeLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
    return await this.redis.getAllTimeLeaderboard(limit);
  }

  // Historical daily leaderboards
  async getHistoricalDailyLeaderboards(
    startDate: string,
    endDate: string
  ): Promise<{ [date: string]: LeaderboardEntry[] }> {
    return await this.redis.getHistoricalDailyLeaderboards(startDate, endDate);
  }

  // User ranking
  async getUserRank(username: string, isDaily: boolean = false): Promise<number> {
    return await this.redis.getUserRank(username, isDaily);
  }

  // Top performers by category
  async getTopPerformers(
    category: 'points' | 'streak' | 'games',
    limit: number = 10
  ): Promise<LeaderboardEntry[]> {
    const allTimeLeaderboard = await this.getAllTimeLeaderboard(1000); // Get more entries for sorting

    switch (category) {
      case 'points':
        return allTimeLeaderboard.sort((a, b) => b.totalPoints - a.totalPoints).slice(0, limit);

      case 'streak':
        return allTimeLeaderboard.sort((a, b) => b.currentStreak - a.currentStreak).slice(0, limit);

      case 'games':
        return allTimeLeaderboard.sort((a, b) => b.gamesPlayed - a.gamesPlayed).slice(0, limit);

      default:
        return allTimeLeaderboard.slice(0, limit);
    }
  }

  // Weekly leaderboard (last 7 days)
  async getWeeklyLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
    const weeklyData: { [username: string]: LeaderboardEntry } = {};
    const today = getServerDateObject();

    // Get data for last 7 days
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = formatToDateString(date);

      const dailyEntries = await this.redis.getDailyLeaderboard(dateStr, 1000);

      dailyEntries.forEach((entry: LeaderboardEntry) => {
        if (!weeklyData[entry.username]) {
          weeklyData[entry.username] = {
            rank: 0,
            username: entry.username,
            totalPoints: 0,
            dailyPoints: 0,
            currentStreak: entry.currentStreak,
            gamesPlayed: 0,
            lastPlayedDate: entry.lastPlayedDate,
          };
        }

        const userData = weeklyData[entry.username];
        if (userData) {
          userData.totalPoints += entry.dailyPoints;
          userData.gamesPlayed += entry.gamesPlayed;
        }
      });
    }

    // Sort by total points and assign ranks
    const sortedEntries = Object.values(weeklyData)
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, limit);

    sortedEntries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return sortedEntries;
  }

  // Monthly leaderboard (current month)
  async getMonthlyLeaderboard(limit: number = 100): Promise<LeaderboardEntry[]> {
    const monthlyData: { [username: string]: LeaderboardEntry } = {};
    const today = getServerDateObject();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    // Get data for current month
    for (let day = 1; day <= today.getDate(); day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateStr = formatToDateString(date);

      const dailyEntries = await this.redis.getDailyLeaderboard(dateStr, 1000);

      dailyEntries.forEach((entry: LeaderboardEntry) => {
        if (!monthlyData[entry.username]) {
          monthlyData[entry.username] = {
            rank: 0,
            username: entry.username,
            totalPoints: 0,
            dailyPoints: 0,
            currentStreak: entry.currentStreak,
            gamesPlayed: 0,
            lastPlayedDate: entry.lastPlayedDate,
          };
        }

        const userData = monthlyData[entry.username];
        if (userData) {
          userData.totalPoints += entry.dailyPoints;
          userData.gamesPlayed += entry.gamesPlayed;
        }
      });
    }

    // Sort by total points and assign ranks
    const sortedEntries = Object.values(monthlyData)
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, limit);

    sortedEntries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return sortedEntries;
  }

  // Leaderboard statistics
  async getLeaderboardStats(): Promise<{
    totalPlayers: number;
    totalGamesPlayed: number;
    totalPointsEarned: number;
    averageScore: number;
    topPlayer: string;
    mostActivePlayer: string;
  }> {
    const allTimeLeaderboard = await this.getAllTimeLeaderboard(1000);

    const totalPlayers = allTimeLeaderboard.length;
    const totalGamesPlayed = allTimeLeaderboard.reduce((sum, entry) => sum + entry.gamesPlayed, 0);
    const totalPointsEarned = allTimeLeaderboard.reduce((sum, entry) => sum + entry.totalPoints, 0);
    const averageScore = totalGamesPlayed > 0 ? totalPointsEarned / totalGamesPlayed : 0;

    const topPlayer = allTimeLeaderboard[0]?.username || 'N/A';
    const mostActivePlayer =
      allTimeLeaderboard.sort((a, b) => b.gamesPlayed - a.gamesPlayed)[0]?.username || 'N/A';

    return {
      totalPlayers,
      totalGamesPlayed,
      totalPointsEarned,
      averageScore,
      topPlayer,
      mostActivePlayer,
    };
  }

  // User's position in leaderboard
  async getUserLeaderboardPosition(username: string): Promise<{
    dailyRank: number;
    allTimeRank: number;
    weeklyRank: number;
    monthlyRank: number;
    dailyPoints: number;
    totalPoints: number;
  }> {
    const dailyRank = await this.getUserRank(username, true);
    const allTimeRank = await this.getUserRank(username, false);

    // Get weekly and monthly ranks
    const weeklyLeaderboard = await this.getWeeklyLeaderboard(1000);
    const monthlyLeaderboard = await this.getMonthlyLeaderboard(1000);

    const weeklyRank = weeklyLeaderboard.findIndex((entry) => entry.username === username) + 1;
    const monthlyRank = monthlyLeaderboard.findIndex((entry) => entry.username === username) + 1;

    // Get user points
    const dailyPoints = await this.redis.getUserPoints(username, true);
    const totalPoints = await this.redis.getUserPoints(username, false);

    return {
      dailyRank: dailyRank > 0 ? dailyRank : 0,
      allTimeRank: allTimeRank > 0 ? allTimeRank : 0,
      weeklyRank: weeklyRank > 0 ? weeklyRank : 0,
      monthlyRank: monthlyRank > 0 ? monthlyRank : 0,
      dailyPoints: dailyPoints || 0,
      totalPoints: totalPoints || 0,
    };
  }
}
