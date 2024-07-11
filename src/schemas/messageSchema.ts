import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "content must be 10 cheracters" })
    .max(300, { message: "content must be 300 cheracters" }),
});
