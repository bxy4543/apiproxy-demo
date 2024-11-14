export interface ApiConfig {
  baseUrl: string;
  headers: {
    [key: string]: string;
  };
}

export interface LeaderboardEntry {
  id: string;
  userId: string;
  userName: string;
  score: number;
  streak: number;
  timestamp: number;
}

export interface GameRecord {
  id: string;
  userId: string;
  poem: string;
  timeSpent: number;
  isCorrect: boolean;
  difficulty: 'easy' | 'hard';
  score: number;
  timestamp: number;
} 