import { NextApiRequest, NextApiResponse } from "next";
import { userService } from "./userService";
import { createUserSchema } from "@/schemas/user/userSchema";
import { prisma } from "@/lib/prisma";

class UserController {
  async createUser(req: NextApiRequest, res: NextApiResponse) {
    try {
      const data = createUserSchema.parse(req.body); // Valida os dados
      const user = await userService.createUser(data);
      return res.status(201).json(user);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      return res.status(400).json({ message: "Erro ao criar usuário" });
    }
  }

  async getUserById(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { id } = req.query;
      const user = await userService.getUserById(id as string);
      if (!user)
        return res.status(404).json({ message: "Usuário não encontrado" });
      return res.status(200).json(user);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
  async deleteUser(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { id } = req.query;

      if (!id || typeof id !== "string") {
        return res.status(400).json({ message: "ID do usuário é obrigatório" });
      }

      const user = await prisma.user.delete({
        where: { id },
      });

      return res
        .status(200)
        .json({ message: "Usuário deletado com sucesso", user });
    } catch (error: any) {
      if (error.code === "P2025") {
        // Código Prisma para "registro não encontrado"
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      console.error("Erro ao deletar usuário:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }

  async getAllUsers(req: NextApiRequest, res: NextApiResponse) {
    try {
      const users = await userService.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      return res.status(500).json({ message: "Erro interno do servidor" });
    }
  }
}

export const userController = new UserController();
