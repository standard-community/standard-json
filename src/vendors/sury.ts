import type { JSONSchema7 } from "json-schema";
import type { Schema } from "sury";
import { ioOf, MissingDependencyError, type ToJsonSchemaFn } from "./utils.js";

// The part of `sury` 11 the handler uses, as the types it's built against are
// those of `sury` 10.
type Sury11 = {
  toInputJSONSchemaOrThrow: ToJsonSchemaFn;
};

export default async function getToJsonSchemaFn(): Promise<ToJsonSchemaFn> {
  try {
    const sury = await import("sury");

    // `sury` 11 replaced `toJSONSchema` with `toInputJSONSchemaOrThrow`, which
    // describes the same side of a schema: the input it accepts.
    if ("toJSONSchema" in sury) {
      const { reverse, toJSONSchema } = sury;
      return (schema, options) =>
        toJSONSchema(
          ioOf(options) === "output"
            ? reverse(schema as Schema<unknown>)
            : (schema as Schema<unknown>),
        ) as JSONSchema7;
    }
    return (sury as unknown as Sury11).toInputJSONSchemaOrThrow;
  } catch {
    throw new MissingDependencyError("sury");
  }
}
