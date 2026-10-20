import type { Type } from "arktype";
import type { JSONSchema7 } from "json-schema";
import type { ToJsonSchemaFn } from "./utils.js";

export default function getToJsonSchemaFn(): ToJsonSchemaFn {
  return (schema, options) =>
    // `arktype` can't describe what a morph outputs, so a schema with one is
    // written as the input it accepts, which is all a schema without one has.
    (schema as Type).in.toJsonSchema(options) as JSONSchema7;
}
