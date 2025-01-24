import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "/api",
});

export class AuthService {
  static async signIn(email: string, password: string) {
    const response = await api.post("/auth/signin", { email, password });
    localStorage.setItem("authToken", response.data.token);
    return response.data.user;
  }

  static async getProfile() {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Usuário não autenticado");

    const response = await api.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  }

  static logout() {
    localStorage.removeItem("authToken");
  }
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      AuthService.logout(); // Remove o token
      window.location.href = "/"; // Redireciona para login
    }
    return Promise.reject(error);
  }
);