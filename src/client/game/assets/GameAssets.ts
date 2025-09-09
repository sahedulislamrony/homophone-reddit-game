// Game theme assets and configurations
export const gameThemes = {
  harryPotter: {
    name: 'Harry Potter',
    backgroundImage: '/images/harrypotter_bg.jpg',
    fallbackGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
    primaryColor: '#fbbf24', // yellow-400
    secondaryColor: '#f59e0b', // yellow-500
    accentColor: '#ef4444', // red-500
  },
  spaceAdventure: {
    name: 'Space Adventure',
    backgroundImage: '/images/space_bg.jpg',
    fallbackGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    primaryColor: '#3b82f6', // blue-500
    secondaryColor: '#2563eb', // blue-600
    accentColor: '#f59e0b', // yellow-500
  },
  oceanExploration: {
    name: 'Ocean Exploration',
    backgroundImage: '/images/ocean_bg.jpg',
    fallbackGradient: 'linear-gradient(135deg, #0c4a6e 0%, #075985 50%, #0369a1 100%)',
    primaryColor: '#06b6d4', // cyan-500
    secondaryColor: '#0891b2', // cyan-600
    accentColor: '#10b981', // emerald-500
  },
  medievalTimes: {
    name: 'Medieval Times',
    backgroundImage: '/images/medieval_bg.jpg',
    fallbackGradient: 'linear-gradient(135deg, #7c2d12 0%, #991b1b 50%, #dc2626 100%)',
    primaryColor: '#f59e0b', // yellow-500
    secondaryColor: '#d97706', // yellow-600
    accentColor: '#dc2626', // red-600
  },
} as const;

export type GameTheme = keyof typeof gameThemes;

export const getThemeConfig = (themeName: string) => {
  const themeKey = Object.keys(gameThemes).find(
    (key) => gameThemes[key as GameTheme].name === themeName
  ) as GameTheme;

  return themeKey ? gameThemes[themeKey] : gameThemes.harryPotter;
};

export const getBackgroundStyle = (themeName: string) => {
  const theme = getThemeConfig(themeName);

  return {
    backgroundImage: theme.backgroundImage.includes('placeholder')
      ? theme.fallbackGradient
      : `url(${theme.backgroundImage})`,
  };
};
