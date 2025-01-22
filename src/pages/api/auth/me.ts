import type { NextApiRequest, NextApiResponse } from 'next';
import { verifyJWT } from '../../../lib/jwt';
import { prisma } from '../../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  setNoCacheHeaders(res);

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: 'Não autorizado' });
  }

  let payload;
  try {
    payload = verifyJWT(token);
  } catch (error) {
    console.error('JWT verification failed:', error);
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }

  if (!payload) {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }

  try {
    const user = await getUserById(payload.userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

// Função auxiliar para buscar o usuário
async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });
}

// Define headers para evitar cache
function setNoCacheHeaders(res: NextApiResponse) {
  res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
}
