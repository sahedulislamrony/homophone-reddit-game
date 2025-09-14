import { Router } from 'express';
import { onAppInstall, menuPostCreate } from '@server/controllers/internal.controller';
import { asyncHandler } from '@server/middleware/asyncHandler.middleware';

const router = Router();

// POST /internal/on-app-install
router.post('/on-app-install', asyncHandler(onAppInstall));

// POST /internal/menu/post-create
router.post('/menu/post-create', asyncHandler(menuPostCreate));

export default router;
