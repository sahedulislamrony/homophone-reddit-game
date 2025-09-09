import { context, reddit } from '@devvit/web/server';

export const createPost = async () => {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  return await reddit.submitCustomPost({
    splash: {
      appIconUri: 'logo.png',
      appDisplayName: 'The Daily Homophone',
      backgroundUri: 'root_bg.png',
      description: 'Hunt down Impostor words and claim your linguistic Victory',
      buttonLabel: 'Play Now',
    },
    subredditName: subredditName,
    title: 'The Daily Homophone',
  });
};
