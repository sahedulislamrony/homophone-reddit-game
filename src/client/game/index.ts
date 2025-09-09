// Main game module exports
export { default as GamePage } from './GamePage';
export { GameEngine } from './engine/GameEngine';
export { GameDataManager } from './data/GameDataManager';
export { sampleGames, getRandomGame, getGameByTheme } from './data/sampleGames';
export { gameThemes, getThemeConfig, getBackgroundStyle } from './assets/GameAssets';
export * from './components';
