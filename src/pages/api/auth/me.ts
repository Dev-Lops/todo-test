import { jwtUtils } from "@/lib/jwt";
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { JwtPayload } from "jsonwebtoken"; // Importe o tipo JwtPayload

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwtUtils.verifyToken(token);

    // Verifica se `decoded` é do tipo `JwtPayload`
    if (typeof decoded !== "object" || !("userId" in decoded)) {
      return res.status(401).json({ message: "Token inválido" });
    }

    const userId = (decoded as JwtPayload).userId; // Casting para JwtPayload

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    console.error("Erro ao verificar token:", error);
    return res.status(401).json({ message: "Token inválido ou expirado" });
  }
}
