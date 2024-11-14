export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
} 