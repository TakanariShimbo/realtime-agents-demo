import type { TurnDetectionType, VadEagerness } from "./constants";

export function buildTurnDetection(opts: {
  turnDetectionType?: TurnDetectionType;
  silenceDurationMs?: number;
  prefixPaddingMs?: number;
  idleTimeoutMs?: number;
  threshold?: number;
  eagerness?: VadEagerness;
  createResponse?: boolean;
}) {
  const { turnDetectionType, silenceDurationMs, prefixPaddingMs, idleTimeoutMs, threshold, eagerness } = opts;
  const td: any = {};
  if (turnDetectionType) td.type = turnDetectionType;
  if (typeof silenceDurationMs === "number") td.silenceDurationMs = silenceDurationMs;
  if (typeof prefixPaddingMs === "number") td.prefixPaddingMs = prefixPaddingMs;
  if (typeof idleTimeoutMs === "number") td.idleTimeoutMs = idleTimeoutMs;
  if (typeof threshold === "number") td.threshold = threshold;
  if (eagerness) td.eagerness = eagerness;
  if (typeof opts.createResponse === "boolean") td.createResponse = opts.createResponse;
  return td;
}
