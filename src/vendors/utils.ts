import type { JSONSchema7 } from "json-schema";
export type ToJsonSchemaFn = (
  schema: unknown,
  options?: Record<string, unknown>,
) => JSONSchema7 | Promise<JSONSchema7>;

export const validationMapper = new Map<string, ToJsonSchemaFn>();

/**
 * The side of a schema `options.io` asks for: what it accepts or what it
 * outputs, which differ for one that transforms or defaults its input.
 */
export const ioOf = (options?: Record<string, unknown>) =>
  options?.io === "input" || options?.io === "output" ? options.io : undefined;

export class UnsupportedVendorError extends Error {
  constructor(vendor: string) {
    super(`standard-json: Unsupported schema vendor "${vendor}".`);
  }
}

export class MissingDependencyError extends Error {
  constructor(packageName: string) {
    super(`standard-json: Missing dependencies "${packageName}".`);
  }
}
