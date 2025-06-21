import type { Schema } from "effect";
import type { JSONSchema7 } from "json-schema";
import { tryImport, type ToJsonSchemaFn } from "./utils.js";

const getToJsonSchemaFn = async (): Promise<ToJsonSchemaFn> => {
  const { JSONSchema } = await tryImport(import("effect"), "effect");
  return (schema) =>
    JSONSchema.make(schema as Schema.Schema<unknown>) as JSONSchema7;
};

export default getToJsonSchemaFn;