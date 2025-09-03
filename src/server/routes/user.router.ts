import { Router } from 'express';
import { getUserData } from '../controllers/user.controller';
import { asyncHandler } from '../middleware/asyncHandler.middleware';

const router = Router();

// GET /api/user
router.get('/user', asyncHandler(getUserData));

export default router;
