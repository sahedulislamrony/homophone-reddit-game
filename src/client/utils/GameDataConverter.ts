import { ThemeData, DailyData, GameObject } from '@shared/types/game';
import { ChallengeLevel } from '@shared/types/challenge';

export class GameDataConverter {
  /**
   * Convert ThemeData to ChallengeLevel format for UI components
   */
  public static themeToChallenge(theme: ThemeData): ChallengeLevel {
    return {
      id: theme.themeId,
      themeName: theme.themeName,
      content: theme.content,
      correctWords: theme.correctWords,
      themeBgImage: theme.themeBgImage,
      hints: theme.hints,
      difficulty: theme.difficulty,
      gemReward: theme.gemsEarn,
      isLocked: theme.isLocked || false,
      isCompleted: theme.isCompleted || false,
      completedAt: theme.completedAt || '',
      score: theme.score || 0,
    };
  }

  /**
   * Convert array of ThemeData to ChallengeLevel array
   */
  public static themesToChallenges(themes: ThemeData[]): ChallengeLevel[] {
    return themes.map((theme) => this.themeToChallenge(theme));
  }

  /**
   * Convert ThemeData to GameObject format for game engine
   */
  public static themeToGameObject(theme: ThemeData): GameObject & { initialPoints: number } {
    return {
      themeName: theme.themeName,
      content: theme.content,
      correctWords: theme.correctWords,
      themeBgImage: theme.themeBgImage,
      hints: theme.hints,
      initialPoints: theme.pointPerCorrectWord,
    };
  }

  /**
   * Convert DailyData to a simplified format for easy access
   */
  public static dailyToSimple(dailyData: DailyData) {
    return {
      date: dailyData.date,
      themes: dailyData.themes,
      totalThemes: dailyData.themes.length,
      completedThemes: dailyData.themes.filter((theme) => theme.isCompleted).length,
      totalGems: dailyData.themes.reduce((sum, theme) => sum + theme.gemsEarn, 0),
      earnedGems: dailyData.themes
        .filter((theme) => theme.isCompleted)
        .reduce((sum, theme) => sum + theme.gemsEarn, 0),
      completionPercentage:
        dailyData.themes.length > 0
          ? Math.round(
              (dailyData.themes.filter((theme) => theme.isCompleted).length /
                dailyData.themes.length) *
                100
            )
          : 0,
    };
  }

  /**
   * Get theme by ID from daily data
   */
  public static getThemeFromDaily(dailyData: DailyData, themeId: string): ThemeData | null {
    return dailyData.themes.find((theme) => theme.themeId === themeId) || null;
  }

  /**
   * Filter themes by difficulty from daily data
   */
  public static getThemesByDifficulty(
    dailyData: DailyData,
    difficulty: 'easy' | 'medium' | 'hard'
  ): ThemeData[] {
    return dailyData.themes.filter((theme) => theme.difficulty === difficulty);
  }

  /**
   * Get completed themes from daily data
   */
  public static getCompletedThemes(dailyData: DailyData): ThemeData[] {
    return dailyData.themes.filter((theme) => theme.isCompleted);
  }

  /**
   * Get incomplete themes from daily data
   */
  public static getIncompleteThemes(dailyData: DailyData): ThemeData[] {
    return dailyData.themes.filter((theme) => !theme.isCompleted);
  }

  /**
   * Calculate total gems for a date
   */
  public static calculateTotalGems(dailyData: DailyData): number {
    return dailyData.themes.reduce((total, theme) => total + theme.gemsEarn, 0);
  }

  /**
   * Calculate earned gems for a date
   */
  public static calculateEarnedGems(dailyData: DailyData): number {
    return dailyData.themes
      .filter((theme) => theme.isCompleted)
      .reduce((total, theme) => total + theme.gemsEarn, 0);
  }

  /**
   * Get completion statistics for a date
   */
  public static getCompletionStats(dailyData: DailyData) {
    const total = dailyData.themes.length;
    const completed = dailyData.themes.filter((theme) => theme.isCompleted).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, percentage };
  }
}
