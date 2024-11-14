export interface Room {
  id: string;
  name: string;
  players: Player[];
  status: 'waiting' | 'playing' | 'finished';
  currentRound: number;
  maxRounds: number;
  difficulty: 'easy' | 'hard';
  createdAt: number;
}

export interface Player {
  id: string;
  name: string;
  avatar?: string;
  score: number;
  status: 'ready' | 'playing' | 'finished';
  currentAnswer?: string;
  answerTime?: number;
}

export interface GameRound {
  roundNumber: number;
  poem: string;
  code: string;
  startTime: number;
  endTime?: number;
  playerAnswers: {
    [playerId: string]: {
      answer: string;
      timeSpent: number;
      isCorrect: boolean;
      score: number;
    };
  };
} 