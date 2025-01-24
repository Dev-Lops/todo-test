import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { email } = req.body;

  if (!email || typeof email !== "string") {
    return res.status(400).json({ message: "Email inválido ou ausente" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    return res.status(200).json({ exists: !!user });
  } catch (error) {
    console.error("Erro ao verificar e-mail:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}
