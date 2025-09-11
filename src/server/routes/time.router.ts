import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

/**
 * Get current server time
 * This endpoint provides the server's current time for client synchronization
 */
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const serverTime = new Date().toISOString();

    res.json({
      success: true,
      serverTime,
      timestamp: Date.now(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  } catch (error) {
    console.error('Error getting server time:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get server time',
    });
  }
});

export default router;
