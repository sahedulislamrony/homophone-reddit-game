import { Request, Response, NextFunction } from 'express';
import { getServerTime } from '../utils/timeUtils';

/**
 * Global error handler middleware
 */
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(`Error in ${req.method} ${req.path}:`, error);

  // Don't send error response if headers already sent
  if (res.headersSent) {
    return;
  }

  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      details: error.message,
    }),
  });
};

/**
 * 404 handler middleware
 */
export const notFoundHandler = (req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.method} ${req.path} not found`,
  });
};

/**
 * Request logging middleware
 */
export const requestLogger = (req: Request, _res: Response, next: NextFunction): void => {
  const timestamp = getServerTime();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
};
