import { GameObject } from '@shared/types/game';

export const sampleGames: GameObject[] = [
  {
    themeName: 'Harry Potter',
    content: 'Hary was a grate wizard who new many spells. He road a broom threw the castle halls.',
    correctWords: ['Harry', 'great', 'knew', 'rode', 'through'],
    themeBgImage: 'placeholder',
    hints: [
      "The main character's name is misspelled",
      'A word meaning "excellent" or "wonderful"',
      'A word meaning "understood" or "was aware"',
      'A word meaning "traveled on horseback"',
      'A word meaning "from one side to the other"',
      'Look for words that sound like common English words',
      'The first word starts with "H"',
      'One word rhymes with "late"',
    ],
    initialPoints: 10,
    difficulty: 'easy',
    gemsEarn: 10,
  },
  {
    themeName: 'Space Adventure',
    content:
      'The astronot looked threw the telescope and saw a grate meteor shower. He new it was going to be an amazing sight.',
    correctWords: ['astronaut', 'through', 'great', 'knew'],
    themeBgImage: 'placeholder',
    hints: [
      'A space traveler is misspelled',
      'A word meaning "from one side to the other"',
      'A word meaning "excellent" or "wonderful"',
      'A word meaning "understood" or "was aware"',
      'Look for words that are missing letters',
      'One word should end with "naut"',
      'The telescope word is wrong',
      'One word rhymes with "blue"',
    ],
    initialPoints: 15,
    difficulty: 'medium',
    gemsEarn: 15,
  },
  {
    themeName: 'Ocean Exploration',
    content:
      'The diver road the current threw the coral reef. She new that the grate barrier reef was home to many fish.',
    correctWords: ['rode', 'through', 'knew', 'great'],
    themeBgImage: 'placeholder',
    hints: [
      'A word meaning "traveled on horseback"',
      'A word meaning "from one side to the other"',
      'A word meaning "understood" or "was aware"',
      'A word meaning "excellent" or "wonderful"',
      'Look for words that sound like common English words',
      'One word rhymes with "code"',
      'The current word is wrong',
      'One word should start with "th"',
    ],
    initialPoints: 20,
    difficulty: 'hard',
    gemsEarn: 20,
  },
  {
    themeName: 'Medieval Times',
    content:
      'The knight road his horse threw the forest. He new that grate danger awaited him ahead.',
    correctWords: ['rode', 'through', 'knew', 'great'],
    themeBgImage: 'placeholder',
    hints: [
      'A word meaning "traveled on horseback"',
      'A word meaning "from one side to the other"',
      'A word meaning "understood" or "was aware"',
      'A word meaning "excellent" or "wonderful"',
      'Look for words that are misspelled',
      'One word rhymes with "code"',
      'The forest word is wrong',
      'One word should start with "th"',
    ],
    initialPoints: 12,
    difficulty: 'easy',
    gemsEarn: 12,
  },
];

export const getRandomGame = (): GameObject => {
  const randomIndex = Math.floor(Math.random() * sampleGames.length);
  return sampleGames[randomIndex]!;
};

export const getGameByTheme = (themeName: string): GameObject | null => {
  return sampleGames.find((game) => game.themeName === themeName) ?? null;
};
