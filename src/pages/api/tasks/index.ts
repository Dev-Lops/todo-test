import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyJWT } from '../../../lib/jwt';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
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

    // Adiciona o userId à requisição
    const userId = payload.userId;

    // Roteamento baseado no método HTTP
    switch (req.method) {
      case 'GET':
        const tasks = await prisma.task.findMany({
          where: {
            userId: userId
          },
          orderBy: {
            createdAt: 'desc'
          }
        });
        return res.status(200).json(tasks);

      case 'POST':
        const { title, description } = req.body;
        const newTask = await prisma.task.create({
          data: {
            title,
            description,
            userId: userId
          }
        });
        return res.status(201).json(newTask);

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error in tasks API:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
} 