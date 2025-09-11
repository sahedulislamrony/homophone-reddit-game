import { Router } from 'express';
import {
  onAppInstall,
  menuPostCreate,
  initializeSampleData,
  getHistoricalLeaderboards,
} from '../controllers/internal.controller';
import { asyncHandler } from '../middleware/asyncHandler.middleware';

const router = Router();

// POST /internal/on-app-install
router.post('/on-app-install', asyncHandler(onAppInstall));

// POST /internal/menu/post-create
router.post('/menu/post-create', asyncHandler(menuPostCreate));

// POST /internal/init-app
router.post('/init-app', asyncHandler(initializeSampleData));

// GET /internal/historical-leaderboards?startDate=yyyy-mm-dd&endDate=yyyy-mm-dd
router.get('/historical-leaderboards', asyncHandler(getHistoricalLeaderboards));

export default router;
