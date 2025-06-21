import type { JSONSchema7 } from "json-schema";
export type ToJsonSchemaFn = (
    schema: unknown,
    options?: unknown,
) => JSONSchema7 | Promise<JSONSchema7>;
  
export const errorMessageWrapper = (message: string) => `standard-json: ${message}`;

export const tryImport = async <T>(
  result: Promise<T>,
  name: string,
): Promise<Awaited<T>> => {
  try {
    return await result;
  } catch {
    throw new Error(errorMessageWrapper(`Missing dependencies "${name}".`));
  }
};