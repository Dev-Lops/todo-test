import { api } from "@/lib/api";
import { jwtUtils } from "@/lib/jwt";
import type { SignUpData } from "@/schemas/auth/signUpSchema";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface SignInResponse {
  token: string;
  user: User;
}

export class AuthService {
  private static instance: AuthService;

  private constructor() {} // Impede a instância direta

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async signIn(credentials: {
    email: string;
    password: string;
  }): Promise<SignInResponse> {
    try {
      const response = await api.post<SignInResponse>(
        "/api/auth/signin",
        credentials
      );
      const { token, user } = response.data;

      if (typeof window !== "undefined") {
        localStorage.setItem("authToken", token);
      }

      return { token, user }; // Retorna ambos
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro ao fazer login");
    }
  }

  async signUp(data: SignUpData): Promise<void> {
    try {
      await api.post("/api/auth/signup", data);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Erro ao criar conta");
    }
  }

  static async getProfile() {
    if (typeof window === "undefined") {
      throw new Error("LocalStorage não está disponível no servidor.");
    }

    const token = localStorage.getItem("authToken"); // Recupera o token armazenado

    if (!token) {
      throw new Error("Token ausente. O usuário não está autenticado.");
    }

    const response = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`, // Envia o token no cabeçalho
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao carregar perfil do usuário.");
    }

    return await response.json(); // Retorna os dados do perfil
  }

  createToken(user: { id: string; email: string }): string {
    return jwtUtils.signToken({ userId: user.id, email: user.email }, "1h");
  }

  verifyToken(token: string): { userId: string; email: string } | null {
    try {
      return jwtUtils.verifyToken(token) as { userId: string; email: string };
    } catch {
      return null;
    }
  }

  signOut(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
    }
  }
}
