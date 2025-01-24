import { userController } from "@/modules/user/userController";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  switch (method) {
    case "GET":
      return userController.getUserById(req, res);
    case "DELETE":
      return userController.deleteUser(req, res);
    default:
      res.setHeader("Allow", ["GET", "DELETE"]);
      return res.status(405).json({ message: "Método não permitido" });
  }
}
