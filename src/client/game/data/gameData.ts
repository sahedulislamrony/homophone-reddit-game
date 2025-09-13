import { GameData } from '@shared/types/game';
import { dailyData } from './dailyData';
import { TimeService } from '@client/services/TimeService';

export const gameData: GameData = {
  dailyData: dailyData,
};

// Helper functions to access game data
export const getGameData = (): GameData => {
  return gameData;
};

export const getDailyData = (date: string) => {
  return gameData.dailyData.find((daily) => daily.date === date) || null;
};

export const getTodayData = async () => {
  const today = await TimeService.getToday();
  return getDailyData(today);
};

export const getThemeData = (date: string, themeId: string) => {
  const dailyData = getDailyData(date);
  if (!dailyData) return null;

  return dailyData.themes.find((theme) => theme.themeId === themeId) || null;
};

export const getAllDates = (): string[] => {
  return gameData.dailyData.map((daily) => daily.date);
};

export const getWeekData = async () => {
  const today = await TimeService.getServerTime();
  const weekData = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateString = date.toISOString().split('T')[0] || date.toISOString().substring(0, 10);

    const dailyData = getDailyData(dateString);
    if (dailyData) {
      weekData.push(dailyData);
    }
  }

  return weekData;
};

export const getThemesByDifficulty = (difficulty: 'easy' | 'medium' | 'hard') => {
  const allThemes = [];

  for (const dailyData of gameData.dailyData) {
    const themes = dailyData.themes.filter((theme) => theme.difficulty === difficulty);
    allThemes.push(...themes);
  }

  return allThemes;
};

export const getTotalGemsForDate = (date: string): number => {
  const dailyData = getDailyData(date);
  if (!dailyData) return 0;

  return dailyData.themes.reduce((total, theme) => total + theme.gemsEarn, 0);
};

export const getEarnedGemsForDate = (date: string): number => {
  const dailyData = getDailyData(date);
  if (!dailyData) return 0;

  return dailyData.themes
    .filter((theme) => theme.isCompleted)
    .reduce((total, theme) => total + theme.gemsEarn, 0);
};

export const getCompletionStats = (date: string) => {
  const dailyData = getDailyData(date);
  if (!dailyData) return { total: 0, completed: 0, percentage: 0 };

  const total = dailyData.themes.length;
  const completed = dailyData.themes.filter((theme) => theme.isCompleted).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { total, completed, percentage };
};

export const getCompletedThemes = (date: string) => {
  const dailyData = getDailyData(date);
  if (!dailyData) return [];

  return dailyData.themes.filter((theme) => theme.isCompleted);
};

export const getIncompleteThemes = (date: string) => {
  const dailyData = getDailyData(date);
  if (!dailyData) return [];

  return dailyData.themes.filter((theme) => !theme.isCompleted);
};

// Note: updateThemeCompletion removed - game data is static and immutable
// Completion status is tracked only in Redis/server data

export const getTotalGemsEarned = (): number => {
  let total = 0;

  for (const dailyData of gameData.dailyData) {
    total += getEarnedGemsForDate(dailyData.date);
  }

  return total;
};

export const getTotalGemsAvailable = (): number => {
  let total = 0;

  for (const dailyData of gameData.dailyData) {
    total += getTotalGemsForDate(dailyData.date);
  }

  return total;
};
