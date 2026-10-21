import type { Type } from "arktype";
import type { JSONSchema7 } from "json-schema";
import { ioOf, type ToJsonSchemaFn } from "./utils.js";

export default function getToJsonSchemaFn(): ToJsonSchemaFn {
  return (schema, options) =>
    // `arktype` can't describe what a morph outputs, so a schema with one is
    // written as the input it accepts unless the output is asked for, which
    // then allows any value where the morph is.
    (schema as Type)[ioOf(options) === "output" ? "out" : "in"].toJsonSchema(
      options,
    ) as JSONSchema7;
}
