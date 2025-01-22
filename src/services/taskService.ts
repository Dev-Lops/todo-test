import { api } from '../lib/api';
import { CreateTaskData } from '../schemas/task.schema';
import { Task } from '../types/task';

export class TaskService {
  private static instance: TaskService;

  private constructor() { }

  static getInstance(): TaskService {
    if (!TaskService.instance) {
      TaskService.instance = new TaskService();
    }
    return TaskService.instance;
  }

  async createTask(data: CreateTaskData): Promise<Task> {
    try {
      const response = await api.post<Task>('/tasks', data);
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro ao criar tarefa');
    }
  }

  async getTasks(): Promise<Task[]> {
    try {
      const response = await api.get<Task[]>('/tasks');
      return response.data;
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro ao carregar tarefas');
    }
  }

  async toggleTask(id: string): Promise<void> {
    try {
      await api.put(`/tasks/${id}/toggle`); // Alterado de patch para put
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro ao atualizar tarefa');
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      await api.delete(`/tasks/${id}`);
    } catch (error: any) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error('Erro ao excluir tarefa');
    }
  }
}