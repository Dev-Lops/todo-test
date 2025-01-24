import { jwtUtils } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token ausente." });
  }

  try {
    const decoded = jwtUtils.verifyToken(token);
    const userId = (decoded as { userId: string }).userId;

    if (!userId) {
      return res.status(401).json({ message: "Usuário inválido." });
    }

    if (req.method === "GET") {
      const tasks = await prisma.task.findMany({
        where: { userId }, // Filtra pelo `userId` do token
      });
      return res.status(200).json(tasks);
    }

    if (req.method === "POST") {
      const { title } = req.body;

      if (!title || typeof title !== "string") {
        return res.status(400).json({ message: "Título inválido." });
      }

      const newTask = await prisma.task.create({
        data: { title, completed: false, userId },
      });

      return res.status(201).json(newTask);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    return res.status(405).json({ message: "Método não permitido." });
  } catch (error) {
    console.error("Erro ao processar a requisição:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
}
