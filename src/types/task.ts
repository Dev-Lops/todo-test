export interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export interface CreateTaskDto {
  title: string;
}

export interface TaskService {
  createTask(title: string): Promise<Task>;
  toggleTask(id: string): Promise<void>;
  deleteTask(id: string): Promise<void>;
  getTasks(): Promise<Task[]>;
} 