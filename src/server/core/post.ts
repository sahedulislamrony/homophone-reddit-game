import { context, reddit } from '@devvit/web/server';

export const createPost = async () => {
  const { subredditName } = context;
  if (!subredditName) {
    throw new Error('subredditName is required');
  }

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return await reddit.submitCustomPost({
    splash: {
      appIconUri: 'logo.png',
      appDisplayName: 'The Daily Homophone',
      backgroundUri: 'splash.png',
      description: 'Hunt down Impostor words and claim your linguistic Victory',
      buttonLabel: 'Play Now',
    },
    subredditName: subredditName,
    title: `Daily Homophone Challenge - ${today} `,
  });
};
