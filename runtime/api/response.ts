import { randomUUID } from 'node:crypto';

import type { ErrorDetail, ResponseMeta, ToolResponse } from './interfaces.ts';

export const EKL_VERSION = '1.0.0';
export const EOR_VERSION = '0.1.0';

export function createMeta(durationMs: number, artifactsLoaded?: number): ResponseMeta {
  return {
    eklVersion: EKL_VERSION,
    eorVersion: EOR_VERSION,
    requestId: randomUUID(),
    durationMs,
    artifactsLoaded,
    capabilityFirst: true,
  };
}

export function success<T>(
  data: T,
  durationMs: number,
  artifactsLoaded?: number,
): ToolResponse<T> {
  return {
    ok: true,
    meta: createMeta(durationMs, artifactsLoaded),
    data,
  };
}

export function failure(
  code: string,
  message: string,
  durationMs: number,
  details?: unknown[],
): ToolResponse<never> {
  const error: ErrorDetail = { code, message, details };
  return {
    ok: false,
    meta: createMeta(durationMs),
    error,
  };
}

export async function timed<T>(
  fn: () => Promise<T>,
): Promise<{ result: T; durationMs: number }> {
  const start = performance.now();
  const result = await fn();
  return { result, durationMs: performance.now() - start };
}

export function pickInput<T extends string>(
  input: Record<string, unknown>,
  camel: T,
  snake: string,
): unknown {
  return input[camel] ?? input[snake];
}

export function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

export function asNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback;
}

export function asBoolean(value: unknown, fallback: boolean): boolean {
  return typeof value === 'boolean' ? value : fallback;
}
