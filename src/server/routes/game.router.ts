import { Router } from 'express';
import { asyncHandler } from '../middleware/asyncHandler.middleware';
import {
  submitGameResult,
  getGameResult,
  getGameResultByChallengeId,
  spendGems,
  canPlayChallenge,
  getUserGameHistory,
  getTodayGames,
  getGameStats,
  getPerformanceData,
  getChallengeHistory,
} from '../controllers/game.controller';

const router = Router();

// Submit game result
router.post('/submit', asyncHandler(submitGameResult));

// Spend gems
router.post('/spend-gems/:username', asyncHandler(spendGems));

// Get game result
router.get('/:gameId', asyncHandler(getGameResult));

// Get game result by challenge ID
router.get('/challenge/:username/:challengeId', asyncHandler(getGameResultByChallengeId));

// Check if user can play challenge
router.get('/can-play/:username/:challengeId', asyncHandler(canPlayChallenge));

// Get user's game history
router.get('/history/:username', asyncHandler(getUserGameHistory));

// Get today's games for user
router.get('/today/:username', asyncHandler(getTodayGames));

// Get game statistics
router.get('/stats/:username', asyncHandler(getGameStats));

// Get performance data
router.get('/performance/:username', asyncHandler(getPerformanceData));

// Get challenge history
router.get('/challenge/:username/:challengeId', asyncHandler(getChallengeHistory));

export default router;
