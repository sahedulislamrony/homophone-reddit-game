// Raw daily challenge data - easily add new days here
export interface DailyChallengeData {
  date: string; // YYYY-MM-DD format
  challenges: {
    id: string;
    themeName: string;
    content: string;
    correctWords: string[];
    themeBgImage: string;
    difficulty: 'easy' | 'medium' | 'hard';
    gemReward: number;
  }[];
}

// Daily challenge data for each day
export const dailyChallengesData: DailyChallengeData[] = [
  // Day 1 - 2024-01-01
  {
    date: '2024-01-01',
    challenges: [
      {
        id: '2024-01-01-harry-potter',
        themeName: 'Harry Potter',
        content:
          'Hary was a grate wizard who new many spells. He road a broom threw the castle halls.',
        correctWords: ['Harry', 'great', 'knew', 'rode', 'through'],
        themeBgImage: '/images/harrypotter_bg.jpg',
        difficulty: 'easy',
        gemReward: 5,
      },
      {
        id: '2024-01-01-space-adventure',
        themeName: 'Space Adventure',
        content:
          'The astronot looked threw the telescope and saw a grate meteor shower. He new it was going to be an amazing sight.',
        correctWords: ['astronaut', 'through', 'great', 'knew'],
        themeBgImage: '/images/space_bg.jpg',
        difficulty: 'medium',
        gemReward: 10,
      },
      {
        id: '2024-01-01-ocean-exploration',
        themeName: 'Ocean Exploration',
        content:
          'The diver road the current threw the coral reef. She new that the grate barrier reef was home to many fish.',
        correctWords: ['rode', 'through', 'knew', 'great'],
        themeBgImage: '/images/ocean_bg.jpg',
        difficulty: 'hard',
        gemReward: 20,
      },
      {
        id: '2024-01-01-medieval-times',
        themeName: 'Medieval Times',
        content:
          'The knight road his horse threw the forest. He new that grate danger awaited him ahead.',
        correctWords: ['rode', 'through', 'knew', 'great'],
        themeBgImage: '/images/medieval_bg.jpg',
        difficulty: 'easy',
        gemReward: 5,
      },
      {
        id: '2024-01-01-fantasy-quest',
        themeName: 'Fantasy Quest',
        content:
          'The mage cast a grate spell and new that the dragon would brake threw the castle walls.',
        correctWords: ['great', 'knew', 'break', 'through'],
        themeBgImage: '/images/fantasy_bg.jpg',
        difficulty: 'medium',
        gemReward: 10,
      },
      {
        id: '2024-01-01-sci-fi-journey',
        themeName: 'Sci-Fi Journey',
        content:
          'The pilot road the ship threw the asteroid field. He new that grate precision was required.',
        correctWords: ['rode', 'through', 'knew', 'great'],
        themeBgImage: '/images/scifi_bg.jpg',
        difficulty: 'hard',
        gemReward: 20,
      },
      {
        id: '2024-01-01-mystery-manor',
        themeName: 'Mystery Manor',
        content:
          'The detective road threw the clues and new that grate deduction would solve the case.',
        correctWords: ['rode', 'through', 'knew', 'great'],
        themeBgImage: '/images/mystery_bg.jpg',
        difficulty: 'easy',
        gemReward: 5,
      },
      {
        id: '2024-01-01-wild-west',
        themeName: 'Wild West',
        content:
          'The cowboy road his horse threw the desert. He new that grate courage was needed.',
        correctWords: ['rode', 'through', 'knew', 'great'],
        themeBgImage: '/images/wildwest_bg.jpg',
        difficulty: 'medium',
        gemReward: 10,
      },
    ],
  },

  // Day 2 - 2024-01-02
  {
    date: '2024-01-02',
    challenges: [
      {
        id: '2024-01-02-magic-academy',
        themeName: 'Magic Academy',
        content:
          'The student was grate at potions but new she needed to brake threw her fears to succeed.',
        correctWords: ['great', 'knew', 'break', 'through'],
        themeBgImage: '/images/magic_bg.jpg',
        difficulty: 'easy',
        gemReward: 5,
      },
      {
        id: '2024-01-02-time-travel',
        themeName: 'Time Travel',
        content:
          'The scientist road threw time and new that grate care was needed to avoid changing history.',
        correctWords: ['rode', 'through', 'knew', 'great'],
        themeBgImage: '/images/time_bg.jpg',
        difficulty: 'medium',
        gemReward: 10,
      },
      {
        id: '2024-01-02-cyber-world',
        themeName: 'Cyber World',
        content: 'The hacker knew the grate firewall would brake threw with the right code.',
        correctWords: ['knew', 'great', 'break', 'through'],
        themeBgImage: '/images/cyber_bg.jpg',
        difficulty: 'hard',
        gemReward: 20,
      },
      {
        id: '2024-01-02-pirate-tale',
        themeName: 'Pirate Tale',
        content: 'The captain road the ship threw the storm. He new that grate skill was required.',
        correctWords: ['rode', 'through', 'knew', 'great'],
        themeBgImage: '/images/pirate_bg.jpg',
        difficulty: 'easy',
        gemReward: 5,
      },
      {
        id: '2024-01-02-dragon-quest',
        themeName: 'Dragon Quest',
        content:
          'The hero knew the grate dragon would brake threw the castle walls if not stopped.',
        correctWords: ['knew', 'great', 'break', 'through'],
        themeBgImage: '/images/dragon_bg.jpg',
        difficulty: 'medium',
        gemReward: 10,
      },
      {
        id: '2024-01-02-robot-rebellion',
        themeName: 'Robot Rebellion',
        content:
          'The engineer road threw the code and new that grate precision was needed to fix the robots.',
        correctWords: ['rode', 'through', 'knew', 'great'],
        themeBgImage: '/images/robot_bg.jpg',
        difficulty: 'hard',
        gemReward: 20,
      },
      {
        id: '2024-01-02-ghost-story',
        themeName: 'Ghost Story',
        content:
          'The ghost road threw the halls and new that grate sadness filled the old mansion.',
        correctWords: ['rode', 'through', 'knew', 'great'],
        themeBgImage: '/images/ghost_bg.jpg',
        difficulty: 'easy',
        gemReward: 5,
      },
      {
        id: '2024-01-02-superhero-tale',
        themeName: 'Superhero Tale',
        content: 'The hero knew the grate villain would brake threw the city defenses.',
        correctWords: ['knew', 'great', 'break', 'through'],
        themeBgImage: '/images/superhero_bg.jpg',
        difficulty: 'medium',
        gemReward: 10,
      },
    ],
  },

  // Day 3 - 2024-01-03
  {
    date: '2024-01-03',
    challenges: [
      {
        id: '2024-01-03-wizard-school',
        themeName: 'Wizard School',
        content:
          'The young wizard was grate at spells but new he needed to brake threw his shyness.',
        correctWords: ['great', 'knew', 'break', 'through'],
        themeBgImage: '/images/wizard_bg.jpg',
        difficulty: 'easy',
        gemReward: 5,
      },
      {
        id: '2024-01-03-alien-invasion',
        themeName: 'Alien Invasion',
        content:
          'The alien road threw the atmosphere and new that grate force was needed to conquer Earth.',
        correctWords: ['rode', 'through', 'knew', 'great'],
        themeBgImage: '/images/alien_bg.jpg',
        difficulty: 'medium',
        gemReward: 10,
      },
      {
        id: '2024-01-03-treasure-hunt',
        themeName: 'Treasure Hunt',
        content:
          'The explorer knew the grate treasure was hidden and would brake threw the ancient seal.',
        correctWords: ['knew', 'great', 'break', 'through'],
        themeBgImage: '/images/treasure_bg.jpg',
        difficulty: 'hard',
        gemReward: 20,
      },
      {
        id: '2024-01-03-ninja-mission',
        themeName: 'Ninja Mission',
        content: 'The ninja road threw the shadows and new that grate stealth was required.',
        correctWords: ['rode', 'through', 'knew', 'great'],
        themeBgImage: '/images/ninja_bg.jpg',
        difficulty: 'easy',
        gemReward: 5,
      },
      {
        id: '2024-01-03-vampire-castle',
        themeName: 'Vampire Castle',
        content: 'The vampire knew the grate power would brake threw the ancient curse.',
        correctWords: ['knew', 'great', 'break', 'through'],
        themeBgImage: '/images/vampire_bg.jpg',
        difficulty: 'medium',
        gemReward: 10,
      },
      {
        id: '2024-01-03-space-station',
        themeName: 'Space Station',
        content: 'The astronaut road threw the space station and new that grate repair was needed.',
        correctWords: ['rode', 'through', 'knew', 'great'],
        themeBgImage: '/images/station_bg.jpg',
        difficulty: 'hard',
        gemReward: 20,
      },
      {
        id: '2024-01-03-fairy-tale',
        themeName: 'Fairy Tale',
        content: 'The fairy knew the grate magic would brake threw the evil spell.',
        correctWords: ['knew', 'great', 'break', 'through'],
        themeBgImage: '/images/fairy_bg.jpg',
        difficulty: 'easy',
        gemReward: 5,
      },
      {
        id: '2024-01-03-samurai-honor',
        themeName: 'Samurai Honor',
        content: 'The samurai road threw the battlefield and new that grate honor was at stake.',
        correctWords: ['rode', 'through', 'knew', 'great'],
        themeBgImage: '/images/samurai_bg.jpg',
        difficulty: 'medium',
        gemReward: 10,
      },
    ],
  },

  // Add more days here...
  // To add a new day, copy the structure above and change the date and content
];

// Helper function to get challenges for a specific date
export const getChallengesForDate = (date: string): DailyChallengeData | null => {
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
