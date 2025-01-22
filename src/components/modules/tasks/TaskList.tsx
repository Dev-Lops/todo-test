import { Task } from '../../../types/task';
import { useTasks } from '../../../hooks/useTasks';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createTaskSchema, type CreateTaskData } from '../../../schemas/task.schema';
import { TaskItem } from './TaskItem';
import { Input } from '../../ui/Input/Input';
import { Button } from '../../ui/Button/Button';

interface TaskListProps {
  initialTasks: Task[];
}

export function TaskList({ initialTasks }: TaskListProps) {
  const { tasks, isLoading, createTask, toggleTask, deleteTask } = useTasks(initialTasks);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<CreateTaskData>({
    resolver: zodResolver(createTaskSchema)
  });

  const onSubmit = async (data: CreateTaskData) => {
    await createTask(data);
    reset();
  };

  return (
    <div className="bg-white mt-4 rounded-lg shadow p-4 w-11/12">
      <h2 className="text-lg font-semibold mb-2 text-black">Lista de Tarefas</h2>

      <div className="bg-gray-50 rounded-lg p-4 shadow-inner">
        <h3 className="font-medium mb-4 text-black">Tarefas Diárias</h3>

        {isLoading && <div>Carregando...</div>}

        <ul>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          ))}
        </ul>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Adicionar nova tarefa"
              error={errors.title?.message}
              {...register('title')}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="whitespace-nowrap"
            >
              Adicionar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 