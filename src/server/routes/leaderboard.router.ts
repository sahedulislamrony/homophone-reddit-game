import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.middleware';
import {
  getDailyLeaderboard,
  getAllTimeLeaderboard,
  getWeeklyLeaderboard,
  getMonthlyLeaderboard,
  getTopPerformers,
  getLeaderboardStats,
  getUserLeaderboardPosition,
  getUserRank,
} from '../controllers/leaderboard.controller';

const router = Router();

// Get daily leaderboard
router.get('/daily', asyncHandler(getDailyLeaderboard));

// Get all-time leaderboard
router.get('/all-time', asyncHandler(getAllTimeLeaderboard));

// Get weekly leaderboard
router.get('/weekly', asyncHandler(getWeeklyLeaderboard));

// Get monthly leaderboard
router.get('/monthly', asyncHandler(getMonthlyLeaderboard));

// Get top performers by category
router.get('/top/:category', asyncHandler(getTopPerformers));

// Get leaderboard statistics
router.get('/stats', asyncHandler(getLeaderboardStats));

// Get user's leaderboard position
router.get('/position/:username', asyncHandler(getUserLeaderboardPosition));

// Get user's rank
router.get('/rank/:username', asyncHandler(getUserRank));

export default router;
