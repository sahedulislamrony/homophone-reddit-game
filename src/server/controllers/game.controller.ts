import { Request, Response } from 'express';
import { InitResponse, IncrementResponse, DecrementResponse } from '@shared/types/api';
import { redis, reddit, context } from '@devvit/web/server';

/**
 * Initialize game data
 */
export const init = async (
  _req: Request,
  res: Response<InitResponse | { status: string; message: string }>
): Promise<void> => {
  const { postId } = context;

  const [count, username] = await Promise.all([redis.get('count'), reddit.getCurrentUsername()]);

  res.json({
    type: 'init',
    postId: postId!,
    count: count ? parseInt(count) : 0,
    username: username ?? 'anonymous',
  });
};

/**
 * Increment game counter
 */
export const increment = async (
  _req: Request,
  res: Response<IncrementResponse | { status: string; message: string }>
): Promise<void> => {
  const { postId } = context;

  const count = await redis.incrBy('count', 1);
  res.json({
    count,
    postId: postId!,
    type: 'increment',
  });
};

/**
 * Decrement game counter
 */
export const decrement = async (
  _req: Request,
  res: Response<DecrementResponse | { status: string; message: string }>
): Promise<void> => {
  const { postId } = context;

  const count = await redis.incrBy('count', -1);
  res.json({
    count,
    postId: postId!,
    type: 'decrement',
  });
};
