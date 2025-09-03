import { Request, Response, NextFunction } from 'express';
import { context } from '@devvit/web/server';

/**
 * Middleware to validate that postId exists in context
 */
export const validatePostId = (
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { postId } = context;
  
  if (!postId) {
    res.status(400).json({
      status: 'error',
      message: 'postId is required but missing from context',
    });
    return;
  }
  
  next();
};
