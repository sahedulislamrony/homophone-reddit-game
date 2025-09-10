import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { GameService } from '../services/GameService';
import { LeaderboardService } from '../services/LeaderboardService';
import { RedisService } from '../services/RedisService';
import { reddit } from '@devvit/web/server';

// Initialize services
const redisService = new RedisService();
const userService = new UserService(redisService);
const gameService = new GameService(redisService, userService);
const leaderboardService = new LeaderboardService(redisService);

/**
 * Get current Reddit user information
 */
export const getCurrentRedditUser = async (_req: Request, res: Response): Promise<void> => {
  try {
    const currentUser = await reddit.getCurrentUser();
    const username = await reddit.getCurrentUsername();

    if (!currentUser || !username) {
      res.json({
        success: true,
        data: {
          type: 'user',
          username: 'anonymous',
          isLoggedIn: false,
        },
      });
      return;
    }

    const avatarUrl = await currentUser.getSnoovatarUrl();

    res.json({
      success: true,
      data: {
        type: 'user',
        username: currentUser.username,
        userId: currentUser.id,
        ...(avatarUrl && { avatarUrl }),
        karma: currentUser.linkKarma + currentUser.commentKarma,
        createdAt: currentUser.createdAt.toISOString(),
        isLoggedIn: true,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to get current user information',
    });
  }
};

/**
 * Get or create user (with optional Reddit user fallback)
 */
export const syncUser = async (req: Request, res: Response): Promise<void> => {
  let { username } = req.body;

  // If no username provided, try to get from Reddit current user
  if (!username || typeof username !== 'string') {
    try {
      const redditUsername = await reddit.getCurrentUsername();
      if (redditUsername) {
        username = redditUsername;
      } else {
        res.status(400).json({ error: 'Username is required' });
        return;
      }
    } catch (error) {
      res.status(400).json({ error: 'Username is required' });
      return;
    }
  }

  const userData = await userService.getUserOrCreate(username);
  const gems = await userService.getGems(username);

  res.json({
    success: true,
    data: {
      userData,
      gems,
    },
  });
};

/**
 * Get user data
 */
export const getUserData = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;
  if (!username) {
    res.status(400).json({ error: 'Username is required' });
    return;
  }

  const userData = await userService.getUserData(username);
  if (!userData) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const gems = await userService.getGems(username);

  res.json({
    success: true,
    data: {
      userData,
      gems,
    },
  });
};

/**
 * Get user stats
 */
export const getUserStats = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;
  if (!username) {
    res.status(400).json({ error: 'Username is required' });
    return;
  }

  const stats = await gameService.getGameStats(username);

  res.json({
    success: true,
    data: stats,
  });
};

/**
 * Get user transactions
 */
export const getUserTransactions = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;
  if (!username) {
    res.status(400).json({ error: 'Username is required' });
    return;
  }

  const limit = parseInt(req.query.limit as string) || 50;
  const transactions = await userService.getUserTransactions(username, limit);

  res.json({
    success: true,
    data: transactions,
  });
};

/**
 * Add gems (admin only)
 */
export const addGems = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;
  if (!username) {
    res.status(400).json({ error: 'Username is required' });
    return;
  }

  const { amount, reason } = req.body;

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    res.status(400).json({ error: 'Valid amount is required' });
    return;
  }

  const newGems = await userService.addGems(username, amount, reason || 'Admin adjustment');

  res.json({
    success: true,
    data: {
      gems: newGems,
    },
  });
};

/**
 * Get user leaderboard position
 */
export const getUserPosition = async (req: Request, res: Response): Promise<void> => {
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
 * Get user performance data
 */
export const getUserPerformance = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;
  if (!username) {
    res.status(400).json({ error: 'Username is required' });
    return;
  }

  const days = parseInt(req.query.days as string) || 30;
  const performance = await gameService.getPerformanceData(username, days);

  res.json({
    success: true,
    data: performance,
  });
};

/**
 * Get user games
 */
export const getUserGames = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;
  if (!username) {
    res.status(400).json({ error: 'Username is required' });
    return;
  }

  const { date, challengeId } = req.query;

  let games;
  if (date) {
    games = await gameService.getUserGamesByDate(username, date as string);
  } else if (challengeId) {
    games = await gameService.getUserGamesByChallenge(username, challengeId as string);
  } else {
    games = await gameService.getUserGames(username);
  }

  res.json({
    success: true,
    data: games,
  });
};
