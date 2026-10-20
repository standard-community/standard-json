import type { Schema } from "effect";
import type { JSONSchema7 } from "json-schema";
import { ioOf, MissingDependencyError, type ToJsonSchemaFn } from "./utils.js";

export default async function getToJsonSchemaFn(): Promise<ToJsonSchemaFn> {
  try {
    const effect = await import("effect");
    return (schema, options) => {
      const io = ioOf(options);
      const side = schema as Schema.Schema<unknown>;
      return effect.JSONSchema.make(
        io === "input"
          ? effect.Schema.encodedSchema(side)
          : io === "output"
            ? effect.Schema.typeSchema(side)
            : side,
      ) as JSONSchema7;
    };
  } catch {
    throw new MissingDependencyError("effect");
  }
}
