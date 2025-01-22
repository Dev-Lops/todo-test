'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { AuthService } from '../services/authService';
import { useRouter } from 'next/router';
import { SignInData } from '../schemas/auth.schema';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (data: SignInData) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const authService = AuthService.getInstance();

  useEffect(() => {
    const checkAuth = async () => {
      if (isLoading) {
        try {
          const userData = await authService.getProfile();
          setUser(userData);
        } catch (error) {
          setUser(null);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkAuth();
  }, []); // Executa apenas uma vez na montagem inicial

  const signIn = async (credentials: SignInData) => {
    try {
      const response = await authService.signIn(credentials);
      setUser(response.user);
      router.replace('/dashboard');
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      router.replace('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext); 