import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { api } from '../lib/api';
import { SignInData, SignUpData } from '../schemas/auth.schema';

interface User {
  id: string;
  name: string;
  email: string;
}

export function useAuthentication() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Verifica a sessão do usuário
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/auth/me');
      setUser(response.data);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!router.isReady) return;

    const isPublicRoute = ['/signin', '/signup'].includes(router.pathname);

    if (!isPublicRoute) {
      checkAuth();
    } else {
      setIsLoading(false); // Evita spinner infinito em rotas públicas
    }
  }, [router.isReady, router.pathname]);


  // Login
  const signIn = useCallback(
    async (data: SignInData) => {
      try {
        setIsLoading(true);
        const response = await api.post('/auth/signin', data);
        setUser(response.data.user);
        router.replace('/dashboard');
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Erro ao fazer login');
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  // Registro
  const signUp = useCallback(
    async (data: SignUpData) => {
      try {
        setIsLoading(true);
        await api.post('/auth/signup', data);
        router.push('/signin');
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Erro ao criar conta');
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  // Logout
  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      await api.post('/auth/signout');
      setUser(null);
      router.replace('/signin');
    } catch {
      console.error('Erro ao fazer logout');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
  };
}
