import { prisma } from "@/lib/prisma";
import { jwtUtils } from "@/lib/jwt";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não fornecido." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwtUtils.verifyToken(token);

    if (typeof decoded !== "object" || !("userId" in decoded)) {
      return res.status(401).json({ message: "Token inválido." });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
}
