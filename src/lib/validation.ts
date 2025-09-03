import { z } from "zod";

export const apiKeySchema = z
  .string()
  .min(24)
  // デモ仕様: ブラウザでは sk- キーのみ受付
  .regex(/^sk-[A-Za-z0-9]{20,}/, "Invalid API key format");

export function isValidApiKey(key: string) {
  return apiKeySchema.safeParse(key).success;
}
