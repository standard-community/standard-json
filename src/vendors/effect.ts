import type { Schema } from "effect";
import type { JSONSchema7 } from "json-schema";
import { type ToJsonSchemaFn, tryImport } from "./utils.js";

export default async function getToJsonSchemaFn(): Promise<ToJsonSchemaFn> {
  const { JSONSchema } = await tryImport(import("effect"), "effect");
  return (schema) =>
    JSONSchema.make(schema as Schema.Schema<unknown>) as JSONSchema7;
}
