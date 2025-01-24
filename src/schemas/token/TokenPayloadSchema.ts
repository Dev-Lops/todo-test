import { z } from "zod";

export const TokenPayloadSchema = z.object({
  userId: z.string().uuid(), // Exige que seja um UUID
  email: z.string().email(), // Exige que seja um email válido
});

export type TokenPayload = z.infer<typeof TokenPayloadSchema>;
