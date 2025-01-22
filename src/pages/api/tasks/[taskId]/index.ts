import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../../lib/prisma';
import { verifyJWT } from '../../../../lib/jwt';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ message: 'Não autorizado' });
  }

  const payload = verifyJWT(token);
  if (!payload) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  const { taskId } = req.query;

  if (!taskId || typeof taskId !== 'string') {
    return res.status(400).json({ message: 'ID da tarefa inválido' });
  }

  // Verificar se a tarefa pertence ao usuário
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      userId: payload.userId,
    },
  });

  if (!task) {
    return res.status(404).json({ message: 'Tarefa não encontrada' });
  }

  // DELETE - Excluir tarefa
  if (req.method === 'DELETE') {
    try {
      await prisma.task.delete({
        where: {
          id: taskId,
        },
      });

      return res.status(200).json({ message: 'Tarefa excluída com sucesso' });
    } catch (error) {
      console.error('Error deleting task:', error);
      return res.status(500).json({ message: 'Erro ao excluir tarefa' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
} 