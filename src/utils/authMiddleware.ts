import { jwtUtils } from "@/lib/jwt";
import { NextApiRequest, NextApiResponse } from "next";


export async function authenticate(
  req: NextApiRequest,
  res: NextApiResponse,
  next: Function
) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  try {
    const decoded = jwtUtils.verifyToken(token);
    (req as any).user = decoded; // Adiciona o usuário decodificado à requisição
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
}
