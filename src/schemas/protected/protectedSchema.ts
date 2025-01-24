import { z } from "zod";

export const protectedSchema = z.object({
  isAuthenticated: z.boolean(),
  isLoading: z.boolean(),
  pathname: z.string(),
});
