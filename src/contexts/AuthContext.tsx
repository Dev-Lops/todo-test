"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/router";
import { api } from "@/lib/api";
import type { SignInData } from "@/schemas/auth/signInSchema";
import type { SignUpData } from "@/schemas/auth/signUpSchema";
import { toast } from "react-toastify";

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
  const [isLoading, setIsLoading] = useState(true); // Indica se está verificando o usuário
  const router = useRouter();

  // Verifica o token e recupera o usuário no carregamento da aplicação
  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(response.data); // Configura o usuário autenticado
    } catch (error: any) {
      console.error("Erro ao verificar autenticação:", error.message);
      localStorage.removeItem("authToken"); // Remove o token inválido
      setUser(null);
    } finally {
      setIsLoading(false); // Finaliza o carregamento
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Realiza login
  const signIn = async (data: SignInData) => {
    try {
      const response = await api.post("/api/auth/signin", data);
      const { token, user } = response.data;

      localStorage.setItem("authToken", token);
      setUser(user);
      toast.success("Login realizado com sucesso!");
      router.push("/");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao fazer login.");
    }
  };

  // Realiza cadastro
  const signUp = async (data: SignUpData) => {
    try {
      await api.post("/api/auth/signup", data);
      toast.success("Conta criada com sucesso!");
      router.replace("/signIn");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erro ao criar conta.");
    }
  };

  // Realiza logout
  const signOut = () => {
    localStorage.removeItem("authToken");
    setUser(null);
    router.replace("/signIn");
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
