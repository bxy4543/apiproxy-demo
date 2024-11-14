import { ApiConfig, LeaderboardEntry, GameRecord } from '@/types/api';
import { User } from '@/types/auth';

const API_CONFIG: ApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
  }
};

export class ApiService {
  private static getHeaders() {
    const token = localStorage.getItem('auth_token');
    return {
      ...API_CONFIG.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  private static async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  // 用户相关API
  static async register(email: string, password: string, name: string): Promise<User> {
    return this.fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  static async login(email: string, password: string): Promise<{ user: User; token: string }> {
    return this.fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // 游戏记录相关API
  static async submitGameRecord(record: Omit<GameRecord, 'id' | 'userId'>): Promise<GameRecord> {
    return this.fetchApi('/game/records', {
      method: 'POST',
      body: JSON.stringify(record),
    });
  }

  static async getLeaderboard(timeRange: 'daily' | 'weekly' | 'allTime'): Promise<LeaderboardEntry[]> {
    return this.fetchApi(`/leaderboard?timeRange=${timeRange}`);
  }

  static async getUserStats(userId: string): Promise<{
    totalGames: number;
    winRate: number;
    averageScore: number;
    bestStreak: number;
  }> {
    return this.fetchApi(`/users/${userId}/stats`);
  }
} 