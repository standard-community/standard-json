import type { Type } from "arktype";
import type { JSONSchema7 } from "json-schema";
import type { ToJsonSchemaFn } from "./utils.js";

export default async function getToJsonSchemaFn(): Promise<ToJsonSchemaFn> {
  return (schema, options) =>
    (schema as Type).toJsonSchema(options) as JSONSchema7;
}
