import { z } from "zod";

export const TokenPayloadSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
});
