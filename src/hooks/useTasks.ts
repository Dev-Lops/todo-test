import { useCallback, useState } from 'react';
import { Task } from '../types/task';
import { TaskService } from '../services/taskService';
import { useNotification } from '../contexts/NotificationContext';
import { CreateTaskData } from '../schemas/task.schema';

const taskService = TaskService.getInstance();

export function useTasks(initialTasks: Task[] = []) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isLoading, setIsLoading] = useState(false);
  const { addNotification } = useNotification();

  const createTask = useCallback(async (data: CreateTaskData) => {
    try {
      setIsLoading(true);
      const newTask = await taskService.createTask(data);
      setTasks(prev => [...prev, newTask]);
      addNotification('Tarefa criada com sucesso!', 'success');
      return newTask;
    } catch (error) {
      addNotification('Erro ao criar tarefa', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  const toggleTask = useCallback(async (taskId: string) => {
    try {
      setIsLoading(true);
      await taskService.toggleTask(taskId);
      setTasks(tasks =>
        tasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
      addNotification('Tarefa atualizada com sucesso!', 'success');
    } catch (error) {
      addNotification('Erro ao atualizar tarefa', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  const deleteTask = useCallback(async (taskId: string) => {
    try {
      setIsLoading(true);
      await taskService.deleteTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      addNotification('Tarefa removida com sucesso!', 'success');
    } catch (error) {
      addNotification('Erro ao remover tarefa', 'error');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [addNotification]);

  return {
    tasks,
    isLoading,
    createTask,
    toggleTask,
    deleteTask,
  };
} 