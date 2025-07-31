import type { Schema } from "effect";
import type { JSONSchema7 } from "json-schema";
import { errorMessageWrapper, type ToJsonSchemaFn } from "./utils.js";

export default async function getToJsonSchemaFn(): Promise<ToJsonSchemaFn> {
  const { JSONSchema } = await import("effect").catch(() => {
    throw new Error(errorMessageWrapper('Missing dependencies "effect".'));
  });
  return (schema) =>
    JSONSchema.make(schema as Schema.Schema<unknown>) as JSONSchema7;
}
