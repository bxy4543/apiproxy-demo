import { User, AuthState } from '@/types/auth';

const AUTH_KEY = 'poem_game_auth';

export const AuthService = {
  getAuthState: (): AuthState => {
    const defaultState: AuthState = {
      user: null,
      isAuthenticated: false,
      loading: true
    };

    try {
      const stored = localStorage.getItem(AUTH_KEY);
      return stored ? JSON.parse(stored) : defaultState;
    } catch {
      return defaultState;
    }
  },

  async login(email: string, password: string): Promise<User> {
    // TODO: 实现真实的登录API
    const mockUser: User = {
      id: '1',
      name: '测试用户',
      email,
      createdAt: Date.now()
    };
    
    localStorage.setItem(AUTH_KEY, JSON.stringify({
      user: mockUser,
      isAuthenticated: true,
      loading: false
    }));
    
    return mockUser;
  },

  async logout() {
    localStorage.removeItem(AUTH_KEY);
  }
}; 