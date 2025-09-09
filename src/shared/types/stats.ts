import { LucideIcon } from 'lucide-react';

export type UserStats = {
  streak: number;
  homophonesSolved: number;
  totalCoins: number;
  todaysRank: number;
  allTimeRank: number;
  gamesPlayed: number;
  bestScore: number;
  averageScore: number;
  hintsUsed: number;
  accuracy: number; // percentage
  joinDate: string;
  lastPlayed: string;
  achievements: Achievement[];
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress: number; // 0-100
  maxProgress: number;
};

export type StatCard = {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: 'primary' | 'accent' | 'success' | 'warning' | 'error';
  trend?: {
    value: number;
    isPositive: boolean;
  };
};
