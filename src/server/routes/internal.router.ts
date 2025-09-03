import { Router } from 'express';
import { onAppInstall, menuPostCreate } from '../controllers/internal.controller';
import { asyncHandler } from '../middleware/asyncHandler.middleware';

const router = Router();

// POST /internal/on-app-install
router.post('/on-app-install', asyncHandler(onAppInstall));

// POST /internal/menu/post-create
router.post('/menu/post-create', asyncHandler(menuPostCreate));

export default router;
