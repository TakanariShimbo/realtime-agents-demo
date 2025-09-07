import { z } from "zod";

const apiKeySchema = z
  .string()
  .min(24)
  .regex(/^sk-[A-Za-z0-9]{20,}/, "Invalid API key format");

export function isValidApiKey(key: string) {
  return apiKeySchema.safeParse(key).success;
}
