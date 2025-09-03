import { Request, Response } from 'express';
import { UserDataResponse } from '@shared/types/api';
import { reddit } from '@devvit/web/server';

/**
 * Get current user data
 */
export const getUserData = async (
  _req: Request,
  res: Response<UserDataResponse | { status: string; message: string }>
): Promise<void> => {
  const currentUser = await reddit.getCurrentUser();
  const username = await reddit.getCurrentUsername();

  if (!currentUser || !username) {
    res.json({
      type: 'user',
      username: 'anonymous',
      isLoggedIn: false,
    });
    return;
  }

  const avatarUrl = await currentUser.getSnoovatarUrl();

  res.json({
    type: 'user',
    username: currentUser.username,
    userId: currentUser.id,
    ...(avatarUrl && { avatarUrl }),
    karma: currentUser.linkKarma + currentUser.commentKarma,
    createdAt: currentUser.createdAt.toISOString(),
    isLoggedIn: true,
  });
};
