import type { JSONSchema7 } from "json-schema";

export const toJsonSchema = async () => {
  try {
    const { zodToJsonSchema } = await import("zod-to-json-schema");
    return zodToJsonSchema as (schema: unknown) => JSONSchema7;
  } catch {
    throw new Error('standard-json: Missing dependencies "zod-to-json-schema"');
  }
};
