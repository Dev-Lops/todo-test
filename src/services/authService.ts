import { api } from "@/lib/api";
import { jwtUtils } from "@/lib/jwt";
import type { SignUpData } from "@/schemas/auth/signUpSchema";
import { toast } from "react-toastify";

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

  private constructor() {}

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

      toast.success("Login realizado com sucesso!");
      return { token, user };
    } catch (error: any) {
      const message = error.response?.data?.message || "Erro ao fazer login.";
      console.error("Erro ao fazer login:", message);

      // Garante que a mensagem de erro seja lançada corretamente
      throw new Error(message);
    }
  }

  async signUp(data: SignUpData): Promise<void> {
    try {
      await api.post("/api/auth/signup", data);
      toast.success("Conta criada com sucesso! Faça login para continuar.");
    } catch (error: any) {
      if (error.response?.status === 409) {
        toast.error("Este email já está em uso. Por favor, tente outro.");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Erro ao criar conta. Tente novamente mais tarde."
        );
      }
      console.error("Erro ao criar conta:", error);
      throw error; // Opcional: permite o controle do erro no contexto
    }
  }

  static async getProfile(): Promise<User> {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error("Token ausente. Faça login novamente.");
    }

    try {
      const response = await api.get<User>("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      return response.data;
    } catch (error: any) {
      console.error("Erro ao carregar perfil do usuário:", error);
      toast.error("Sessão inválida. Faça login novamente.");
      localStorage.removeItem("authToken");
      throw new Error("Erro ao carregar perfil do usuário.");
    }
  }

  createToken(user: { id: string; email: string }): string {
    if (!user.id || !user.email) {
      throw new Error("Dados do usuário inválidos para criar token.");
    }
    return jwtUtils.signToken({ userId: user.id, email: user.email }, "1h");
  }

  verifyToken(token: string): { userId: string; email: string } | null {
    try {
      return jwtUtils.verifyToken(token) as { userId: string; email: string };
    } catch {
      console.error("Token inválido ou expirado.");
      return null;
    }
  }

  async signOut(): Promise<void> {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Nenhuma sessão ativa encontrada.");
        return;
      }

      // Remove o token do localStorage
      localStorage.removeItem("authToken");
      toast.success("Logout realizado com sucesso.");
      window.location.href = "/signIn";
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error);
      toast.error("Erro ao fazer logout. Tente novamente mais tarde.");
    }
  }
}
