import { Request, Response } from 'express';
import { context } from '@devvit/web/server';
import { createPost } from '../core/post';

/**
 * Handle app installation
 */
export const onAppInstall = async (_req: Request, res: Response): Promise<void> => {
  try {
    const post = await createPost();

    res.json({
      status: 'success',
      message: `App installed successfully in subreddit ${context.subredditName} with post id ${post.id}. New users will start with 10 gems.`,
    });
  } catch (error) {
    console.error('Error during app installation:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to install app',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Handle post creation from menu
 */
export const menuPostCreate = async (_req: Request, res: Response): Promise<void> => {
  const post = await createPost();

  res.json({
    navigateTo: `https://reddit.com/r/${context.subredditName}/comments/${post.id}`,
  });
};
