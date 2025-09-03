import { Router } from 'express';
import userRoutes from './user.router';
import gameRoutes from './game.router';
import internalRoutes from './internal.router';

const router = Router();

// API routes
router.use('/api', userRoutes);
router.use('/api', gameRoutes);

// Internal routes
router.use('/internal', internalRoutes);

export default router;
