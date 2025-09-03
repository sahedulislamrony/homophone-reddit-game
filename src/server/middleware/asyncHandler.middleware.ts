import { Request, Response, NextFunction } from 'express';

/**
 * Async handler wrapper to catch errors in async route handlers
 * and pass them to the error handling middleware
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
