import { Router } from 'express';
import userRoutes from './user.router';
import gameRoutes from './game.router';
import leaderboardRoutes from './leaderboard.router';
import internalRoutes from './internal.router';
import timeRoutes from './time.router';

const router = Router();

// API routes
router.use('/api/users', userRoutes);
router.use('/api/games', gameRoutes);
router.use('/api/leaderboard', leaderboardRoutes);
router.use('/api/time', timeRoutes);

// Internal routes
router.use('/internal', internalRoutes);

export default router;
