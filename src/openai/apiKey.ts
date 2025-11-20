import { z } from "zod";

const apiKeySchema = z
  .string()
  .min(24)
  .max(100)
  // ブラウザでは sk- キーのみ受付（長さは最大 100 文字まで許可）
  .regex(/^sk-[A-Za-z0-9_-]{20,}/, "Invalid API key format");

export function isValidApiKey(key: string) {
  return apiKeySchema.safeParse(key).success;
}
