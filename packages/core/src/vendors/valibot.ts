import type { BaseIssue, BaseSchema } from "valibot";
import { tryImport, type ToJsonSchemaFn } from "./index.js";

export const getToJsonSchemaFn = async (): Promise<ToJsonSchemaFn> => {
  const { toJsonSchema } = await tryImport(
    import("@valibot/to-json-schema"),
    "@valibot/to-json-schema",
  );
  return (schema, options) =>
    toJsonSchema(
      schema as BaseSchema<unknown, unknown, BaseIssue<unknown>>,
      options as Record<string, unknown>,
    );
};
