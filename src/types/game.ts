export interface GameState {
  score: number;
  highScore: number;
  currentStreak: number;
  bestStreak: number;
  gamesPlayed: number;
  correctAnswers: number;
  wrongAnswers: number;
}

export interface PoemHistory {
  poem: string;
  timestamp: number;
  isCorrect: boolean;
  timeSpent: number;
  difficulty: 'easy' | 'hard';
} 