import { userController } from "@/modules/user/userController";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  try {
    switch (method) {
      case "POST":
        return await userController.createUser(req, res);
      case "GET":
        return await userController.getAllUsers(req, res);
      default:
        res.setHeader("Allow", ["POST", "GET"]);
        return res.status(405).json({ message: "Método não permitido" });
    }
  } catch (error: unknown) {
    console.error("Erro no handler da API:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido";
    return res.status(500).json({ message: errorMessage });
  }
}
