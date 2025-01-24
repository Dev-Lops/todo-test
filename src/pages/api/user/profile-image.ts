// import type { NextApiRequest, NextApiResponse } from "next";
// import { prisma } from "../../../lib/prisma";
// import { verifyJWT } from "../../../lib/jwt";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== "PUT") {
//     return res.status(405).json({ message: "Method not allowed" });
//   }

//   const token = req.cookies.authToken;

//   if (!token) {
//     return res.status(401).json({ message: "Não autorizado" });
//   }

//   let payload;
//   try {
//     payload = verifyJWT(token);
//   } catch (error) {
//     console.error("JWT verification failed:", error);
//     return res.status(401).json({ message: "Token inválido ou expirado" });
//   }

//   const { profileImage } = req.body;

//   if (!profileImage) {
//     return res.status(400).json({ message: "A URL da imagem é obrigatória" });
//   }

//   try {
//     const updatedUser = await prisma.user.update({
//       where: { id: payload?.userId },
//       data: { profile_image: profileImage },
//     });

//     return res.status(200).json(updatedUser);
//   } catch (error) {
//     console.error("Erro ao atualizar foto de perfil:", error);
//     return res.status(500).json({ message: "Erro interno do servidor" });
//   }
// }
