import type { Schema } from "effect";
import type { JSONSchema7 } from "json-schema";
import { MissingDependencyError, type ToJsonSchemaFn } from "./utils.js";

export default async function getToJsonSchemaFn(): Promise<ToJsonSchemaFn> {
  try {
    const { JSONSchema } = await import("effect");
    return (schema) =>
      JSONSchema.make(schema as Schema.Schema<unknown>) as JSONSchema7;
  } catch {
    throw new MissingDependencyError("effect");
  }
}
