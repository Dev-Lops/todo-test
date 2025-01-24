import { TokenPayloadSchema } from "@/schemas/token/TokenPayloadSchema";
import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

interface CustomJwtPayload extends JwtPayload {
  userId: string;
  email: string;
}

export const jwtUtils = {
  /**
   * Assina um token JWT com o payload fornecido.
   * @param payload - Objeto contendo as informações a serem assinadas.
   * @param expiresIn - Tempo de expiração do token. Padrão: "7d".
   * @returns Token JWT assinado.
   */
  signToken: (payload: { userId: string; email: string }, expiresIn = "7d") => {
    const validation = TokenPayloadSchema.safeParse(payload);
    if (!validation.success) {
      throw new Error("Payload inválido para o token JWT.");
    }
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  },

  /**
   * Verifica um token JWT e retorna o payload decodificado.
   * @param token - Token JWT a ser verificado.
   * @returns Payload decodificado contendo userId e email.
   * @throws Erro caso o token seja inválido ou tenha expirado.
   */
  verifyToken: (token: string): CustomJwtPayload => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as CustomJwtPayload;

      if (!decoded.userId || !decoded.email) {
        throw new Error("Token inválido ou propriedades ausentes.");
      }

      return decoded;
    } catch (error) {
      console.error("Erro ao verificar token:", error);
      throw new Error("Token inválido ou expirado.");
    }
  },
};
