import type { JSONSchema7 } from "json-schema";

export const toJsonSchema = async () => {
  try {
    const { toJsonSchema } = await import("@valibot/to-json-schema");
    return toJsonSchema as (schema: unknown) => JSONSchema7;
  } catch {
    throw new Error(
      'standard-json: Missing dependencies "@valibot/to-json-schema"',
    );
  }
};
