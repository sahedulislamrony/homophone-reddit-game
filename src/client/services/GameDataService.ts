import { ThemeData, DailyData, GameData } from '@shared/types/game';

export class GameDataService {
  private static instance: GameDataService;
  private gameData: GameData = { dailyData: [] };

  private constructor() {
    this.initializeGameData();
  }

  public static getInstance(): GameDataService {
    if (!GameDataService.instance) {
      GameDataService.instance = new GameDataService();
    }
    return GameDataService.instance;
  }

  private initializeGameData(): void {
    // Initialize with sample daily data for the current week
    const today = new Date();
    const dailyData: DailyData[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0] || date.toISOString().substring(0, 10);

      dailyData.push({
        date: dateString,
        themes: this.generateThemesForDate(dateString, i),
      });
    }

    this.gameData = { dailyData };
  }

  private generateThemesForDate(date: string, dayOffset: number): ThemeData[] {
    const themes: ThemeData[] = [
      {
        themeId: `harry-potter-${date}`,
        themeName: 'Harry Potter',
        content: 'Find the homophones in this magical world!',
        correctWords: ['witch', 'which', 'wand', 'wound', 'flew', 'flu'],
        difficulty: 'easy',
        gemsEarn: 10,
        initialPoints: 100,
        themeBgImage: '/images/harrypotter_bg.jpg',
        hints: [
          'Think about magical creatures',
          'Consider spell components',
          'Look for words that sound the same',
          'Think about wizarding tools',
        ],
        isLocked: false,
        isCompleted: false,
      },
      {
        themeId: `space-adventure-${date}`,
        themeName: 'Space Adventure',
        content: 'Navigate through space with homophones!',
        correctWords: ['mars', 'mars', 'star', 'stare', 'moon', 'moon'],
        difficulty: 'medium',
        gemsEarn: 15,
        initialPoints: 150,
        themeBgImage: '/images/space_bg.jpg',
        hints: [
          'Look to the stars',
          'Consider planetary names',
          'Think about space exploration',
          'Consider celestial bodies',
        ],
        isLocked: false,
        isCompleted: false,
      },
      {
        themeId: `ocean-depths-${date}`,
        themeName: 'Ocean Depths',
        content: 'Dive deep and find the homophones!',
        correctWords: ['sea', 'see', 'wave', 'waive', 'tide', 'tied'],
        difficulty: 'hard',
        gemsEarn: 20,
        initialPoints: 200,
        themeBgImage: '/images/ocean_bg.jpg',
        hints: [
          'Think about the ocean',
          'Consider water-related words',
          'Think about marine life',
          'Consider nautical terms',
        ],
        isLocked: false,
        isCompleted: false,
      },
    ];

    // Add more themes for variety
    if (dayOffset > 0) {
      themes.push({
        themeId: `medieval-${date}`,
        themeName: 'Medieval Times',
        content: 'Journey through medieval homophones!',
        correctWords: ['knight', 'night', 'sword', 'soared', 'castle', 'cassel'],
        difficulty: 'medium',
        gemsEarn: 18,
        initialPoints: 180,
        themeBgImage: '/images/medieval_bg.jpg',
        hints: [
          'Think about knights and castles',
          'Consider medieval weapons',
          'Think about royal titles',
          'Consider ancient battles',
        ],
        isLocked: false,
        isCompleted: false,
      });
    }

    return themes;
  }

  public getGameData(): GameData {
    return this.gameData;
  }

  public getDailyData(date: string): DailyData | null {
    return this.gameData.dailyData.find((daily) => daily.date === date) || null;
  }

  public getTodayData(): DailyData | null {
    const today =
      new Date().toISOString().split('T')[0] || new Date().toISOString().substring(0, 10);
    return this.getDailyData(today);
  }

  public getThemeData(date: string, themeId: string): ThemeData | null {
    const dailyData = this.getDailyData(date);
    if (!dailyData) return null;

    return dailyData.themes.find((theme) => theme.themeId === themeId) || null;
  }

  public updateThemeCompletion(
    date: string,
    themeId: string,
    score: number,
    completedAt: string
  ): void {
    const dailyData = this.getDailyData(date);
    if (!dailyData) return;

    const theme = dailyData.themes.find((t) => t.themeId === themeId);
    if (theme) {
      theme.isCompleted = true;
      theme.score = score;
      theme.completedAt = completedAt;
    }
  }

  public getCompletedThemes(date: string): ThemeData[] {
    const dailyData = this.getDailyData(date);
    if (!dailyData) return [];

    return dailyData.themes.filter((theme) => theme.isCompleted);
  }

  public getIncompleteThemes(date: string): ThemeData[] {
    const dailyData = this.getDailyData(date);
    if (!dailyData) return [];

    return dailyData.themes.filter((theme) => !theme.isCompleted);
  }

  public getTotalGemsForDate(date: string): number {
    const dailyData = this.getDailyData(date);
    if (!dailyData) return 0;

    return dailyData.themes.reduce((total, theme) => total + theme.gemsEarn, 0);
  }

  public getEarnedGemsForDate(date: string): number {
    const completedThemes = this.getCompletedThemes(date);
    return completedThemes.reduce((total, theme) => total + theme.gemsEarn, 0);
  }

  public getCompletionStats(date: string): {
    total: number;
    completed: number;
    percentage: number;
  } {
    const dailyData = this.getDailyData(date);
    if (!dailyData) return { total: 0, completed: 0, percentage: 0 };

    const total = dailyData.themes.length;
    const completed = dailyData.themes.filter((theme) => theme.isCompleted).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, percentage };
  }

  public getAllDates(): string[] {
    return this.gameData.dailyData.map((daily) => daily.date);
  }

  public getWeekData(): DailyData[] {
    const today = new Date();
    const weekData: DailyData[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0] || date.toISOString().substring(0, 10);

      const dailyData = this.getDailyData(dateString);
      if (dailyData) {
        weekData.push(dailyData);
      }
    }

    return weekData;
  }

  public getThemeById(themeId: string): ThemeData | null {
    for (const dailyData of this.gameData.dailyData) {
      const theme = dailyData.themes.find((t) => t.themeId === themeId);
      if (theme) return theme;
    }
    return null;
  }

  public getThemesByDifficulty(difficulty: 'easy' | 'medium' | 'hard'): ThemeData[] {
    const allThemes: ThemeData[] = [];

    for (const dailyData of this.gameData.dailyData) {
      const themes = dailyData.themes.filter((theme) => theme.difficulty === difficulty);
      allThemes.push(...themes);
    }

    return allThemes;
  }

  public getTotalGemsEarned(): number {
    let total = 0;

    for (const dailyData of this.gameData.dailyData) {
      total += this.getEarnedGemsForDate(dailyData.date);
    }

    return total;
  }

  public getTotalGemsAvailable(): number {
    let total = 0;

    for (const dailyData of this.gameData.dailyData) {
      total += this.getTotalGemsForDate(dailyData.date);
    }

    return total;
  }
}
