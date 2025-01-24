import { api } from "@/lib/api";
import type { Task } from "@/types/task";

export class TaskService {
  static async getTasks(): Promise<Task[]> {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Token ausente.");

    const response = await api.get<Task[]>("/api/tasks", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  }

  static async createTask(title: string): Promise<Task> {
    const token = localStorage.getItem("authToken");
    if (!token) throw new Error("Token ausente.");

    const response = await api.post<Task>(
      "/api/tasks",
      { title },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  }

  static async updateTask(
    id: string,
    updates: Partial<{ title: string; description: string }>
  ): Promise<Task> {
    const response = await api.patch<Task>(`/api/tasks/${id}`, updates);
    return response.data;
  }

  static async toggleTask(taskId: string, completed: boolean): Promise<void> {
    if (!taskId) throw new Error("Task ID é obrigatório.");
    await api.patch(`/api/tasks/${taskId}`, { completed });
  }

  static async deleteTask(taskId: string): Promise<void> {
    if (!taskId || typeof taskId !== "string") {
      throw new Error("Task ID é obrigatório e deve ser uma string.");
    }
    await api.delete(`/api/tasks/${taskId}`);
  }
}
