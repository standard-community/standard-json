import { ioOf, MissingDependencyError, type ToJsonSchemaFn } from "./utils.js";

export default async function getToJsonSchemaFn(): Promise<ToJsonSchemaFn> {
  try {
    const { toJsonSchema } = await import("@valibot/to-json-schema");
    return ((schema, options) =>
      // `valibot` can't describe what a `transform` outputs, so a schema with
      // one is written as the input it accepts unless the output is asked for,
      // which then throws on a `transform` that no schema follows.
      toJsonSchema(schema as never, {
        typeMode: ioOf(options) ?? "input",
        ...options,
      })) as ToJsonSchemaFn;
  } catch {
    throw new MissingDependencyError("@valibot/to-json-schema");
  }
}
