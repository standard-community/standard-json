import type { JSONSchema7 } from "json-schema";
export type ToJsonSchemaFn = (
  schema: unknown,
  options?: Record<string, unknown>,
) => JSONSchema7 | Promise<JSONSchema7>;

export const errorMessageWrapper = (message: string) =>
  `standard-json: ${message}`;
