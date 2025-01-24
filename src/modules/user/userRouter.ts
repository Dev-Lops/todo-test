import { NextApiRequest, NextApiResponse } from "next";
import { userController } from "./userController";
import { authenticate } from "@/utils/authMiddleware";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req;

  await authenticate(req, res, async () => {
    switch (method) {
      case "POST":
        return userController.createUser(req, res);
      case "GET":
        if (query.id) {
          return userController.getUserById(req, res);
        }
        return userController.getAllUsers(req, res);
      case "DELETE":
        return userController.deleteUser(req, res);
      default:
        res.setHeader("Allow", ["POST", "GET", "DELETE"]);
        return res.status(405).json({ message: "Método não permitido" });
    }
  });
}
