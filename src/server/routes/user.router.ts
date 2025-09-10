import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.middleware';
import {
  getCurrentRedditUser,
  syncUser,
  getUserData,
  getUserStats,
  getUserTransactions,
  addGems,
  getUserPosition,
  getUserPerformance,
  getUserGames,
} from '../controllers/user.controller';

const router = Router();

// Get current Reddit user information
router.get('/current', asyncHandler(getCurrentRedditUser));

// Get or create user
router.post('/sync', asyncHandler(syncUser));

// Get user data
router.get('/:username', asyncHandler(getUserData));

// Get user stats
router.get('/:username/stats', asyncHandler(getUserStats));

// Get user transactions
router.get('/:username/transactions', asyncHandler(getUserTransactions));

// Add gems (admin only)
router.post('/:username/gems', asyncHandler(addGems));

// Get user leaderboard position
router.get('/:username/rank', asyncHandler(getUserPosition));

// Get user performance data
router.get('/:username/performance', asyncHandler(getUserPerformance));

// Get user games
router.get('/:username/games', asyncHandler(getUserGames));

export default router;
