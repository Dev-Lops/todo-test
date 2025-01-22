import axios from 'axios';

interface SignInCredentials {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  name: string;
}

interface SignInResponse {
  token: string;
  user: User;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
});

// Interceptor para adicionar o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para gerenciar erros globais
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async signIn({ email, password }: SignInCredentials): Promise<SignInResponse> {
    const response = await api.post('/auth/signin', {
      email,
      password,
    });

    localStorage.setItem('token', response.data.token);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
  },
};
