import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { GameService } from '../services/GameService';
import { RedisService } from '../services/RedisService';

// Initialize services
const redisService = new RedisService();
const userService = new UserService(redisService);
const gameService = new GameService(redisService, userService);

/**
 * Submit game result
 */
export const submitGameResult = async (req: Request, res: Response): Promise<void> => {
  const {
    username,
    challengeId,
    score,
    hintsUsed,
    freeHintsUsed,
    gemsSpent,
    timeSpent,
    difficulty,
    themeName,
  } = req.body;

  // Validate required fields
  if (!username || !challengeId || typeof score !== 'number') {
    res.status(400).json({ error: 'Missing required fields' });
    return;
  }

  // Check if user can play this game
  const canPlay = await gameService.canPlayGame(username, challengeId);
  if (!canPlay.canPlay) {
    res.status(400).json({
      error: canPlay.reason || 'Cannot play this game',
      gemsAvailable: canPlay.gemsAvailable,
    });
    return;
  }

  // Save game result
  const gameResult = await gameService.saveGameResult(username, challengeId, {
    score,
    hintsUsed: hintsUsed || 0,
    freeHintsUsed: freeHintsUsed || 0,
    gemsSpent: gemsSpent || 0,
    timeSpent: timeSpent || 0,
    difficulty: difficulty || 'easy',
    themeName: themeName || 'Unknown',
  });

  res.json({
    success: true,
    data: gameResult,
  });
};

/**
 * Get game result
 */
export const getGameResult = async (req: Request, res: Response): Promise<void> => {
  const { gameId } = req.params;
  if (!gameId) {
    res.status(400).json({ error: 'Game ID is required' });
    return;
  }

  const gameResult = await gameService.getGameResult(gameId);
  if (!gameResult) {
    res.status(404).json({ error: 'Game not found' });
    return;
  }

  res.json({
    success: true,
    data: gameResult,
  });
};

/**
 * Get game result by challenge ID
 */
export const getGameResultByChallengeId = async (req: Request, res: Response): Promise<void> => {
  const { username, challengeId } = req.params;
  if (!username || !challengeId) {
    res.status(400).json({ error: 'Username and challenge ID are required' });
    return;
  }

  const gameResult = await gameService.getGameResultByChallengeId(username, challengeId);
  if (!gameResult) {
    res.status(404).json({ error: 'Game result not found' });
    return;
  }

  res.json({
    success: true,
    data: gameResult,
  });
};

/**
 * Spend gems
 */
export const spendGems = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;
  const { amount } = req.body;

  if (!username || !amount || amount <= 0) {
    res.status(400).json({ error: 'Username and valid amount are required' });
    return;
  }

  const success = await gameService.spendGems(username, amount);
  if (!success) {
    res.status(400).json({ error: 'Insufficient gems' });
    return;
  }

  res.json({
    success: true,
    message: `Successfully spent ${amount} gems`,
  });
};

/**
 * Check if user can play challenge
 */
export const canPlayChallenge = async (req: Request, res: Response): Promise<void> => {
  const { username, challengeId } = req.params;
  if (!username || !challengeId) {
    res.status(400).json({ error: 'Username and challenge ID are required' });
    return;
  }

  const canPlay = await gameService.canPlayGame(username, challengeId);

  res.json({
    success: true,
    data: canPlay,
  });
};

/**
 * Get user's game history
 */
export const getUserGameHistory = async (req: Request, res: Response): Promise<void> => {
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

/**
 * Get today's games for user
 */
export const getTodayGames = async (req: Request, res: Response): Promise<void> => {
  const { username } = req.params;
  const { date } = req.query;

  if (!username) {
    res.status(400).json({ error: 'Username is required' });
    return;
  }

  const games = await gameService.getTodayGames(username, date as string);

  res.json({
    success: true,
    data: games,
  });
};

/**
 * Get game statistics
 */
export const getGameStats = async (req: Request, res: Response): Promise<void> => {
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
 * Get performance data
 */
export const getPerformanceData = async (req: Request, res: Response): Promise<void> => {
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
 * Get challenge history
 */
export const getChallengeHistory = async (req: Request, res: Response): Promise<void> => {
  const { username, challengeId } = req.params;
  if (!username || !challengeId) {
    res.status(400).json({ error: 'Username and challenge ID are required' });
    return;
  }

  const games = await gameService.getChallengeHistory(username, challengeId);

  res.json({
    success: true,
    data: games,
  });
};
