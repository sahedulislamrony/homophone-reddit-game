import { GameObject, GameState } from '@shared/types/game';

export class GameDataManager {
  private static instance: GameDataManager;
  private currentGame: GameObject | null = null;
  private gameState: GameState | null = null;

  private constructor() {}

  static getInstance(): GameDataManager {
    if (!GameDataManager.instance) {
      GameDataManager.instance = new GameDataManager();
    }
    return GameDataManager.instance;
  }

  setCurrentGame(game: GameObject): void {
    this.currentGame = game;
  }

  getCurrentGame(): GameObject | null {
    return this.currentGame;
  }

  setGameState(state: GameState): void {
    this.gameState = state;
  }

  getGameState(): GameState | null {
    return this.gameState;
  }

  resetGameData(): void {
    this.currentGame = null;
    this.gameState = null;
  }

  // Create initial game state
  createInitialGameState(): GameState {
    return {
      currentWordIndex: 0,
      userAnswers: [],
      score: 0,
      hintsUsed: 0,
      gems: 10, // Start with 10 gems
      freeHintsUsed: 0,
      isCompleted: false,
    };
  }

  // Save game progress (for future persistence)
  saveGameProgress(): void {
    // This could be extended to save to localStorage or API
    if (this.gameState) {
      localStorage.setItem('gameProgress', JSON.stringify(this.gameState));
    }
  }

  // Load game progress (for future persistence)
  loadGameProgress(): GameState | null {
    try {
      const saved = localStorage.getItem('gameProgress');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }
}
