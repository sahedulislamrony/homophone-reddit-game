import { GameObject } from '@shared/types/game';

export const sampleGames: GameObject[] = [
  {
    themeName: 'Harry Potter',
    content: 'Hary was a grate wizard who new many spells. He road a broom threw the castle halls.',
    correctWords: ['Harry', 'great', 'knew', 'rode', 'through'],
    themeBgImage: 'placeholder',
  },
  {
    themeName: 'Space Adventure',
    content:
      'The astronot looked threw the telescope and saw a grate meteor shower. He new it was going to be an amazing sight.',
    correctWords: ['astronaut', 'through', 'great', 'knew'],
    themeBgImage: 'placeholder',
  },
  {
    themeName: 'Ocean Exploration',
    content:
      'The diver road the current threw the coral reef. She new that the grate barrier reef was home to many fish.',
    correctWords: ['rode', 'through', 'knew', 'great'],
    themeBgImage: 'placeholder',
  },
  {
    themeName: 'Medieval Times',
    content:
      'The knight road his horse threw the forest. He new that grate danger awaited him ahead.',
    correctWords: ['rode', 'through', 'knew', 'great'],
    themeBgImage: 'placeholder',
  },
];

export const getRandomGame = (): GameObject => {
  const randomIndex = Math.floor(Math.random() * sampleGames.length);
  return sampleGames[randomIndex]!;
};

export const getGameByTheme = (themeName: string): GameObject | null => {
  return sampleGames.find((game) => game.themeName === themeName) ?? null;
};
