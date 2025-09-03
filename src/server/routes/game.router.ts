import { Router } from 'express';
import { init, increment, decrement } from '../controllers/game.controller';
import { validatePostId } from '../middleware/validation.middleware';
import { asyncHandler } from '../middleware/asyncHandler.middleware';

const router = Router();

// GET /api/init
router.get('/init', validatePostId, asyncHandler(init));

// POST /api/increment
router.post('/increment', validatePostId, asyncHandler(increment));

// POST /api/decrement
router.post('/decrement', validatePostId, asyncHandler(decrement));

export default router;
