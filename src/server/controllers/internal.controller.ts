import { Request, Response } from 'express';
import { context } from '@devvit/web/server';
import { createPost } from '../core/post';
import { RedisService } from '../services/RedisService';

/**
 * Handle app installation
 */
export const onAppInstall = async (_req: Request, res: Response): Promise<void> => {
  try {
    // Initialize sample data for new installation
    const redisService = new RedisService();
    await redisService.initializeSampleData();

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

/**
 * Initialize app (no dummy data)
 */
export const initializeSampleData = async (_req: Request, res: Response): Promise<void> => {
  try {
    const redisService = new RedisService();
    await redisService.initializeSampleData();

    res.json({
      success: true,
      message: 'App initialized successfully - New users will start with 10 gems',
    });
  } catch (error) {
    console.error('Error initializing app:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to initialize app',
    });
  }
};
