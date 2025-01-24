import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs"; // Caso você use bcrypt
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Dados inválidos" });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "E-mail já está em uso. Tente outro." });
    }

    const hashedPassword = await hash(password, 10); // Criptografa a senha

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res
      .status(201)
      .json({ message: "Usuário criado com sucesso!", user });
  } catch (error) {
    console.error("Erro ao criar conta:", error);
    return res.status(500).json({ message: "Erro interno do servidor" });
  }
}
