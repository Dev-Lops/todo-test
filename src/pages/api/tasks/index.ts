import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const tasks = await prisma.task.findMany();
      return res.status(200).json(tasks);
    } catch (error) {
      console.error("Erro ao buscar tasks:", error);
      return res.status(500).json({ message: "Erro ao buscar tarefas." });
    }
  }

  if (req.method === "POST") {
    const { title, userId } = req.body;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ message: "Título inválido." });
    }

    try {
      const newTask = await prisma.task.create({
        data: {
          title,
          completed: false,
          user: { connect: { id: userId } }, // Relaciona com o usuário
        },
      });
      return res.status(201).json(newTask);
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      return res.status(500).json({ message: "Erro ao criar tarefa." });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ message: "Método não permitido" });
}
