import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { compare } from "bcrypt";
import { jwtUtils } from "@/lib/jwt";


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Por favor, forneça email e senha" });
  }

  try {
    console.log("Recebendo email para login:", email);

    // Verifica se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }, // Normaliza o email
    });

    if (!user) {
      console.error("Usuário não encontrado:", email);
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    console.log("Usuário encontrado:", user);

    // Valida a senha
    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      console.error("Senha inválida para o usuário:", email);
      return res.status(401).json({ message: "Senha inválida." });
    }

    console.log("Senha válida para o usuário:", email);

    // Gera o token JWT
    const payload = {
      userId: user.id,
      email: user.email,
    };

    const token = jwtUtils.signToken(payload);
    console.log("Token gerado:", token);

    res.status(200).json({
      user: { id: user.id, name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.error("Erro interno no servidor:", error);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
}
