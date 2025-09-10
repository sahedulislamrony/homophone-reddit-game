import { Request, Response } from 'express';
import { LeaderboardService } from '../services/LeaderboardService';
import { RedisService } from '../services/RedisService';

// Initialize services
const redisService = new RedisService();
const leaderboardService = new LeaderboardService(redisService);

/**
 * Get daily leaderboard
 */
export const getDailyLeaderboard = async (req: Request, res: Response): Promise<void> => {
  const { date, limit } = req.query;
  const limitNum = parseInt(limit as string) || 100;

  const leaderboard = await leaderboardService.getDailyLeaderboard(date as string, limitNum);

  res.json({
    success: true,
    data: leaderboard,
  });
};

/**
 * Get all-time leaderboard
 */
export const getAllTimeLeaderboard = async (req: Request, res: Response): Promise<void> => {
  const { limit } = req.query;
  const limitNum = parseInt(limit as string) || 100;

  const leaderboard = await leaderboardService.getAllTimeLeaderboard(limitNum);

  res.json({
    success: true,
    data: leaderboard,
  });
};

/**
 * Get weekly leaderboard
 */
export const getWeeklyLeaderboard = async (req: Request, res: Response): Promise<void> => {
  const { limit } = req.query;
  const limitNum = parseInt(limit as string) || 100;

  const leaderboard = await leaderboardService.getWeeklyLeaderboard(limitNum);

  res.json({
    success: true,
    data: leaderboard,
  });
};

/**
 * Get monthly leaderboard
 */
export const getMonthlyLeaderboard = async (req: Request, res: Response): Promise<void> => {
  const { limit } = req.query;
  const limitNum = parseInt(limit as string) || 100;

  const leaderboard = await leaderboardService.getMonthlyLeaderboard(limitNum);

  res.json({
    success: true,
    data: leaderboard,
  });
};

/**
 * Get top performers by category
 */
export const getTopPerformers = async (req: Request, res: Response): Promise<void> => {
  const { category } = req.params;
  const { limit } = req.query;
  const limitNum = parseInt(limit as string) || 10;

  if (!category || !['points', 'streak', 'games'].includes(category)) {
    res.status(400).json({ error: 'Invalid category. Must be: points, streak, or games' });
    return;
  }

  const leaderboard = await leaderboardService.getTopPerformers(
    category as 'points' | 'streak' | 'games',
    limitNum
  );

  res.json({
    success: true,
    data: leaderboard,
  });
};

/**
 * Get leaderboard statistics
 */
export const getLeaderboardStats = async (_req: Request, res: Response): Promise<void> => {
  const stats = await leaderboardService.getLeaderboardStats();

  res.json({
    success: true,
    data: stats,
  });
};

/**
 * Get user's leaderboard position
 */
export const getUserLeaderboardPosition = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;
  if (!username) {
    res.status(400).json({ error: 'Username is required' });
    return;
  }

  const position = await leaderboardService.getUserLeaderboardPosition(username);

  res.json({
    success: true,
    data: position,
  });
};

/**
 * Get user's rank
 */
export const getUserRank = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;
  if (!username) {
    res.status(400).json({ error: 'Username is required' });
    return;
  }

  const { daily } = req.query;
  const isDaily = daily === 'true';

  const rank = await leaderboardService.getUserRank(username, isDaily);

  res.json({
    success: true,
    data: {
      rank: rank > 0 ? rank : null,
      isDaily,
    },
  });
};
