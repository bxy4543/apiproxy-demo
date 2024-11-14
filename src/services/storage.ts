import { GameState, PoemHistory } from '@/types/game';

const GAME_STATE_KEY = 'poem_game_state';
const POEM_HISTORY_KEY = 'poem_history';
const USED_POEMS_KEY = 'used_poems';

export const StorageService = {
  getGameState: (): GameState => {
    const defaultState: GameState = {
      score: 0,
      highScore: 0,
      currentStreak: 0,
      bestStreak: 0,
      gamesPlayed: 0,
      correctAnswers: 0,
      wrongAnswers: 0
    };

    try {
      const stored = localStorage.getItem(GAME_STATE_KEY);
      return stored ? JSON.parse(stored) : defaultState;
    } catch {
      return defaultState;
    }
  },

  saveGameState: (state: GameState) => {
    localStorage.setItem(GAME_STATE_KEY, JSON.stringify(state));
  },

  getPoemHistory: (): PoemHistory[] => {
    try {
      const stored = localStorage.getItem(POEM_HISTORY_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  savePoemHistory: (history: PoemHistory[]) => {
    localStorage.setItem(POEM_HISTORY_KEY, JSON.stringify(history));
  },

  getUsedPoems: (): string[] => {
    try {
      const stored = localStorage.getItem(USED_POEMS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  saveUsedPoems: (poems: string[]) => {
    localStorage.setItem(USED_POEMS_KEY, JSON.stringify(poems));
  },

  addUsedPoem: (poem: string) => {
    const usedPoems = StorageService.getUsedPoems();
    if (!usedPoems.includes(poem)) {
      usedPoems.push(poem);
      StorageService.saveUsedPoems(usedPoems);
    }
  },

  clearUsedPoems: () => {
    localStorage.removeItem(USED_POEMS_KEY);
  }
}; 