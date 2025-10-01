// Import week data
import { week3Challenges, week4Challenges } from './assets';

import { DailyData } from '@shared/types/game';

/**
 * Default fallback game data used when no specific data is available for a requested date.
 * This ensures that the game always has content to show, even for dates without
 * specifically crafted challenges. The fallback data includes 6 themes across
 * different difficulty levels: 2 easy, 2 medium, and 2 hard themes.
 */
const defaultFallbackData: DailyData = {
  date: '2025-09-16',
  themes: [
    {
      themeId: 'homophone-easy-2025-09-25-01',
      themeName: 'Weather Report',
      content:
        'Whether it will rain or not depends on the weather patterns forming over the ocean, and we will sea if the son comes out later.',
      correctWords: ['Weather', 'see', 'sun'],
      difficulty: 'easy',
      gemsEarn: 5,
      pointPerCorrectWord: 10,
      themeBgImage: '/images/weather_bg.jpg',
      hints: [
        'Atmospheric conditions (capitalized for beginning of sentence)',
        'To perceive with eyes (not "body of water")',
        'The star that gives us light (not "male child")',
        'All words relate to weather forecasting',
      ],
    },
    {
      themeId: 'homophone-easy-2025-09-25-02',
      themeName: 'Grocery Shopping',
      content:
        'She bought a pair of fruits including a pear and some apples, plus meet for dinner and flower for baking.',
      correctWords: ['pear', 'meat', 'flour'],
      difficulty: 'easy',
      gemsEarn: 5,
      pointPerCorrectWord: 10,
      themeBgImage: '/images/grocery_bg.jpg',
      hints: [
        'A type of fruit (not "two of something")',
        'Animal flesh used as food (not "encounter")',
        'Baking ingredient (not "blossom")',
        'All words relate to grocery items',
      ],
    },
    {
      themeId: 'homophone-mid-2025-09-25-03',
      themeName: 'Historical Event',
      content:
        'The general led his troops through the mountain pass to surprise the enemy, knowing they had to break threw their defenses.',
      correctWords: ['led', 'through', 'break through'],
      difficulty: 'medium',
      gemsEarn: 8,
      pointPerCorrectWord: 10,
      themeBgImage: '/images/history_bg.jpg',
      hints: [
        'Guided or commanded (not "the metal")',
        'Moving from one side to another (not "past tense of throw")',
        'To penetrate defenses (not "destroy")',
        'All words relate to military strategy',
      ],
    },
    {
      themeId: 'homophone-mid-2025-09-25-04',
      themeName: 'Fashion Show',
      content:
        'The model wore a suit dress that complemented the evening gowns on the runway, looking absolutely gorgeous in the bright lights.',
      correctWords: ['model', 'suit', 'runway', 'gorgeous'],
      difficulty: 'medium',
      gemsEarn: 8,
      pointPerCorrectWord: 10,
      themeBgImage: '/images/fashion_bg.jpg',
      hints: [
        'Fashion professional (not "a type of")',
        'Matching outfit (not "sweet")',
        'Fashion show platform (not "away")',
        'Beautiful (not "canyon")',
        'All words relate to fashion events',
      ],
    },
    {
      themeId: 'homophone-hard-2025-09-25-05',
      themeName: 'Legal Drama',
      content:
        'The witness was called to give a deposition about what she had seen at the crime scene, and she knew her testimony could affect the case outcome.',
      correctWords: ['witness', 'seen', 'scene', 'affect'],
      difficulty: 'hard',
      gemsEarn: 15,
      pointPerCorrectWord: 10,
      themeBgImage: '/images/legal_bg.jpg',
      hints: [
        'Person who testifies (not "wit")',
        'Observed (not "prophet")',
        'Location of event (not "view")',
        'Influence (not "result")',
        'All words relate to legal proceedings',
      ],
    },
    {
      themeId: 'homophone-hard-2025-09-25-06',
      themeName: 'Medical Mystery',
      content:
        'The patient complained of pain in his heel, but the doctor could find no physical cause, leaving the medical team to wonder whether it was psychological.',
      correctWords: ['pain', 'heel', 'whether', 'psychological'],
      difficulty: 'hard',
      gemsEarn: 20,
      pointPerCorrectWord: 10,
      themeBgImage: '/images/medical_bg.jpg',
      hints: [
        'Physical discomfort (not "precipitation")',
        'Back of foot (not "recover")',
        'If (not "climate conditions")',
        'Mental rather than physical (not "physical")',
        'All words relate to medical diagnosis',
      ],
    },
  ],
};

// Daily challenge data for each day - imported from week files
export const dailyChallengesData: DailyData[] = [...week3Challenges, ...week4Challenges];

/**
 * Get challenges for a specific date with automatic fallback support.
 *
 * @param date - The date string in YYYY-MM-DD format
 * @returns DailyData for the requested date, either from the official data or fallback
 *
 * If official challenge data exists for the date, it returns that data.
 * Otherwise, it returns the default fallback data with:
 * - The requested date
 * - Unique theme IDs generated for that specific date
 * - All original theme content and structure preserved
 */
export const getChallengesForDate = (date: string): DailyData => {
  const foundData = dailyChallengesData.find((day) => day.date === date);

  if (foundData) {
    return foundData;
  }

  // Return fallback data with the requested date
  return {
    ...defaultFallbackData,
    date: date, // Use the requested date instead of the fallback's original date
    themes: defaultFallbackData.themes.map((theme, index) => ({
      ...theme,
      themeId: `fallback-${date}-${index + 1}`, // Generate unique theme IDs for the requested date
    })),
  };
};

/**
 * Check if the data for a specific date is fallback data (not official content).
 *
 * @param date - The date string in YYYY-MM-DD format
 * @returns true if the date uses fallback data, false if official data exists
 */
export const isFallbackData = (date: string): boolean => {
  return !dailyChallengesData.some((day) => day.date === date);
};

// Helper function to get all available dates (excluding fallback)
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
