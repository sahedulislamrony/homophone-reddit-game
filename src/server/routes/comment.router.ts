import { Router } from 'express';
import { submitGameResultComment } from '../controllers/comment.controller';
import { asyncHandler } from '../middleware/asyncHandler.middleware';

const router = Router();

// POST /api/comments/submit-game-result
router.post('/submit-game-result', asyncHandler(submitGameResultComment));

export default router;
