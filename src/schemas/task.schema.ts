import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
});

export type CreateTaskData = z.infer<typeof createTaskSchema>; 