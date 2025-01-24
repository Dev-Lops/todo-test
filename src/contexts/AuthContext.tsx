"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { AuthService } from "../services/authService";
import { useRouter } from "next/router";
import type { SignInData } from "@/schemas/auth/signInSchema";
import type { SignUpData } from "@/schemas/auth/signUpSchema";

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
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const authService = AuthService.getInstance();

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    try {
      const userData = await AuthService.getProfile();
      setUser(userData);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Erro ao verificar autenticação:", error.message);
      } else {
        console.error("Erro ao verificar autenticação:", error);
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const signIn = async (credentials: SignInData) => {
    try {
      const response = await authService.signIn(credentials); // Retorna token e user
      localStorage.setItem("authToken", response.token); // Salva o token
      setUser(response.user); // Salva o usuário no estado
      router.replace("/dashboard"); // Redireciona
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw new Error("Credenciais inválidas ou problema no servidor");
    }
  };

  const signUp = async (data: SignUpData) => {
    try {
      await authService.signUp(data);
      router.replace("/signIn");
    } catch (error) {
      console.error("Erro ao criar conta:", error);
      throw new Error("Erro ao criar conta ou problema no servidor");
    }
  };

  const signOut = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    router.replace("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
