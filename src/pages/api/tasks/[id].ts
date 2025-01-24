import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "ID inválido ou ausente." });
  }

  try {
    if (req.method === "PATCH") {
      const { completed } = req.body;

      if (typeof completed !== "boolean") {
        return res
          .status(400)
          .json({ message: "Campo 'completed' inválido ou ausente." });
      }

      const updatedTask = await prisma.task.update({
        where: { id },
        data: { completed },
      });

      return res.status(200).json(updatedTask);
    }

    if (req.method === "DELETE") {
      await prisma.task.delete({
        where: { id },
      });
      return res.status(204).end();
    }

    // Permitir apenas os métodos específicos
    res.setHeader("Allow", ["PATCH", "DELETE"]);
    return res.status(405).json({ message: "Método não permitido." });
  } catch (error) {
    console.error("Erro ao processar tarefa:", error);
    return res.status(500).json({ message: "Erro interno do servidor." });
  }
}
