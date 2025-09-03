import { z } from 'zod'

export const apiKeySchema = z
  .string()
  .min(16)
  // Accept regular keys (sk-...) or ephemeral client keys (ek_...)
  .regex(/^(sk-[A-Za-z0-9]{20,}|ek_[A-Za-z0-9\-_]{16,})/, 'Invalid API key format')

export function isValidApiKey(key: string) {
  return apiKeySchema.safeParse(key).success
}
