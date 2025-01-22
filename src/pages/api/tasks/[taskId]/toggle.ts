import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { verifyJWT } from '../../../../lib/jwt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Verifica se existe um token nos cookies
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: 'Não autorizado' });
  }

  try {
    // Verifica o token
    const payload = verifyJWT(token);
    if (!payload) {
      return res.status(401).json({ message: 'Token inválido' });
    }

    const { taskId } = req.query;

    if (!taskId || typeof taskId !== 'string') {
      return res.status(400).json({ message: 'ID da tarefa inválido' });
    }

    // Buscar a tarefa atual
    const currentTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        userId: payload.userId,
      },
    });

    if (!currentTask) {
      return res.status(404).json({ message: 'Tarefa não encontrada' });
    }

    // Atualizar o status da tarefa
    const updatedTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        completed: !currentTask.completed,
      },
    });

    return res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error toggling task:', error);
    return res.status(500).json({ message: 'Erro ao atualizar tarefa' });
  }
} 