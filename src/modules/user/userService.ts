import { prisma } from "@/lib/prisma";
import type { CreateUserInput } from "@/schemas/user/userSchema";


class UserService {
  async createUser(data: CreateUserInput) {
    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password, // A senha já deve estar hashada
      },
    });
  }

  async getUserById(id: string) {
    return await prisma.user.findUnique({ where: { id } });
  }

  async getAllUsers() {
    return await prisma.user.findMany();
  }
}

export const userService = new UserService();
