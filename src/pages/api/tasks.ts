import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  if (req.method === 'POST') {
    try {
      const { title } = req.body;
      
      const task = await prisma.task.create({
        data: {
          title,
          userId: session.user.id,
          description: '',
          completed: false,
        },
        select: {
          id: true,
          title: true,
          completed: true,
        },
      });

      return res.status(201).json(task);
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      return res.status(500).json({ error: 'Erro ao criar tarefa' });
    }
  } else if (req.method === "GET") {
    const tasks = await prisma.task.findMany();
    res.status(200).json(tasks);
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
