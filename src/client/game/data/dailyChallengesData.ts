// Import week data
import { week1Challenges } from './assets/week1';
import { week2Challenges } from './assets/week2';
import { DailyData } from '@shared/types/game';

// Raw daily challenge data - easily add new days here

// Daily challenge data for each day - imported from week files
export const dailyChallengesData: DailyData[] = [...week1Challenges, ...week2Challenges];

// Helper function to get challenges for a specific date
export const getChallengesForDate = (date: string): DailyData | null => {
  return dailyChallengesData.find((day) => day.date === date) ?? null;
};

// Helper function to get all available dates
export const getAvailableDates = (): string[] => {
  return dailyChallengesData.map((day) => day.date);
};

// Helper function to get the next available date after a given date
export const getNextDate = (currentDate: string): string | null => {
  const dates = getAvailableDates().sort();
  const currentIndex = dates.indexOf(currentDate);
  return currentIndex >= 0 && currentIndex < dates.length - 1
    ? (dates[currentIndex + 1] ?? null)
    : null;
};

// Helper function to get the previous available date before a given date
export const getPreviousDate = (currentDate: string): string | null => {
  const dates = getAvailableDates().sort();
  const currentIndex = dates.indexOf(currentDate);
  return currentIndex > 0 ? (dates[currentIndex - 1] ?? null) : null;
};
