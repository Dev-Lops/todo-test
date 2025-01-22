import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authService } from '../services/auth';
import { User } from '../types/user'; // Correct the casing to match the actual file name

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const userData = await authService.getProfile();
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.signIn({ email, password });
      setUser(response.user);
      await router.push('/dashboard');
      return response;
    } catch (error) {
      const errorMessage =
        (error as any).response?.data?.message || 'Erro ao fazer login';
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      authService.logout();
      setUser(null);
      await router.push('/signin');
    } finally {
      setIsLoading(false);
    }
  };

  return { user, isAuthenticated: !!user, isLoading, signIn, logout };
}
