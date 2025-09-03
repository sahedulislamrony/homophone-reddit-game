import { Request, Response } from 'express';
import { context } from '@devvit/web/server';
import { createPost } from '../core/post';

/**
 * Handle app installation
 */
export const onAppInstall = async (
  _req: Request,
  res: Response<{ status: string; message: string }>
): Promise<void> => {
  const post = await createPost();

  res.json({
    status: 'success',
    message: `Post created in subreddit ${context.subredditName} with id ${post.id}`,
  });
};

/**
 * Handle post creation from menu
 */
export const menuPostCreate = async (
  _req: Request,
  res: Response<{ navigateTo?: string; status?: string; message?: string }>
): Promise<void> => {
  const post = await createPost();

  res.json({
    navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
  });
};
