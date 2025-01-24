import { TokenPayloadSchema } from "@/schemas/token/TokenPayloadSchema";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const jwtUtils = {
  signToken: (payload: object, expiresIn = "7d") => {
    const validation = TokenPayloadSchema.safeParse(payload);
    if (!validation.success) {
      throw new Error("Payload inválido para o token JWT");
    }
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  },

  verifyToken: (token: string) => {
    return jwt.verify(token, JWT_SECRET);
  },
};
