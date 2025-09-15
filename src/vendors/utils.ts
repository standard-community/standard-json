import type { JSONSchema7 } from "json-schema";
export type ToJsonSchemaFn = (
  schema: unknown,
  options?: Record<string, unknown>,
) => JSONSchema7 | Promise<JSONSchema7>;

export const validationMapper = new Map<string, ToJsonSchemaFn>();

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
