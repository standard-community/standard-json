import type { JSONSchema7 } from "json-schema";
import type { ZodSchema } from "zod";
import { tryImport, type ToJsonSchemaFn } from "./index.js";

export const getToJsonSchemaFn = async (): Promise<ToJsonSchemaFn> => {
  const { zodToJsonSchema } = await tryImport(
    import("zod-to-json-schema"),
    "zod-to-json-schema",
  );
  return (schema, options) =>
    zodToJsonSchema(
      schema as ZodSchema<unknown>,
      options as Record<string, unknown>,
    ) as JSONSchema7;
};
