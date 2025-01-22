import { api } from '../lib/api';
import { SignInData, SignUpData } from '../schemas/auth.schema';

interface User {
  id: string;
  name: string;
  email: string;
}

export class AuthService {
  private static instance: AuthService;

  private constructor() { }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signIn(credentials: SignInData): Promise<{ user: User }> {
    try {
      const response = await api.post<{ user: User; token: string }>('/auth/signin', credentials);

      // Armazena o token no localStorage
      localStorage.setItem('authToken', response.data.token);

      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao fazer login';
      throw new Error(message);
    }
  }

  async signOut(): Promise<void> {
    try {
      await api.post('/auth/signout');

      // Remove o token do localStorage
      localStorage.removeItem('authToken');
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error('Erro ao fazer logout');
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await api.get<User>('/auth/me');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        throw new Error('Sessão expirada');
      }
      throw new Error('Erro ao carregar perfil');
    }
  }

  async signUp(data: SignUpData): Promise<void> {
    try {
      await api.post('/auth/signup', data);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao criar conta';
      throw new Error(message);
    }
  }
}
