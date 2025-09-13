import { Request, Response } from 'express';
import { context, reddit } from '@devvit/web/server';

/**
 * Submit a comment on a Reddit post with game result
 */
export const submitGameResultComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gameResult, username } = req.body;

    if (!gameResult || !username) {
      res.status(400).json({
        status: 'error',
        message: 'gameResult and username are required',
      });
      return;
    }

    // Get the current post ID from context
    const postId = context.postId;
    if (!postId) {
      res.status(400).json({
        status: 'error',
        message: 'No post context available for commenting',
      });
      return;
    }

    // Format the comment text with game result data
    const getScoreEmoji = (score: number) => {
      if (score >= 90) return '🌟';
      if (score >= 80) return '🏆';
      if (score >= 70) return '🥇';
      if (score >= 60) return '🥈';
      return '💪';
    };

    const getDifficultyEmoji = (difficulty: string) => {
      switch (difficulty.toLowerCase()) {
        case 'easy':
          return '🟢';
        case 'medium':
          return '🟡';
        case 'hard':
          return '🔴';
        default:
          return '⚪';
      }
    };

    const getThemeEmoji = (theme: string) => {
      const themeLower = theme.toLowerCase();
      if (themeLower.includes('space')) return '🚀';
      if (themeLower.includes('harry') || themeLower.includes('potter')) return '⚡';
      if (themeLower.includes('ocean') || themeLower.includes('sea')) return '🌊';
      if (themeLower.includes('forest') || themeLower.includes('nature')) return '🌲';
      if (themeLower.includes('city') || themeLower.includes('urban')) return '🏙️';
      return '🎯';
    };

    const commentText = `# 🎮 Daily Homophone Challenge Result 🎮

---

## 👤 Player Info
**Player:** u/${username}

## 🎯 Game Stats
${getScoreEmoji(gameResult.score)} **Score:** ${gameResult.score} points  
⏱️ **Time:** ${gameResult.timeSpent}s  
💡 **Hints Used:** ${gameResult.hintsUsed}  
${getDifficultyEmoji(gameResult.difficulty)} **Difficulty:** ${gameResult.difficulty}  
${getThemeEmoji(gameResult.themeName)} **Theme:** ${gameResult.themeName}  

---

## 🎉 Performance
${
  gameResult.score >= 90
    ? "🌟 **PERFECT SCORE!** You're a homophone master!"
    : gameResult.score >= 80
      ? '🏆 **EXCELLENT!** Outstanding performance!'
      : gameResult.score >= 70
        ? '🥇 **GREAT JOB!** Well done!'
        : gameResult.score >= 60
          ? '👍 **GOOD WORK!** Keep it up!'
          : "💪 **KEEP PRACTICING!** You'll get better!"
}

---

*🤖 Posted via [Daily Homophone Challenge App](https://www.reddit.com/r/dailyhomophone_dev)*`;

    // Submit the comment using Reddit API
    await reddit.submitComment({
      id: postId,
      text: commentText,
      runAs: 'USER',
    });

    res.json({
      status: 'success',
      message: 'Comment posted successfully',
    });
  } catch (error) {
    console.error('Error submitting comment:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to submit comment',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
