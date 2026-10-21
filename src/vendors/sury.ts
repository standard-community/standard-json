import type { JSONSchema7 } from "json-schema";
import type { Schema } from "sury";
import { ioOf, MissingDependencyError, type ToJsonSchemaFn } from "./utils.js";

export default async function getToJsonSchemaFn(): Promise<ToJsonSchemaFn> {
  try {
    const { reverse, toJSONSchema } = await import("sury");
    return (schema, options) =>
      toJSONSchema(
        ioOf(options) === "output"
          ? reverse(schema as Schema<unknown>)
          : (schema as Schema<unknown>),
      ) as JSONSchema7;
  } catch {
    throw new MissingDependencyError("sury");
  }
}
