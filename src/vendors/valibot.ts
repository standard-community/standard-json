import { MissingDependencyError, type ToJsonSchemaFn } from "./utils.js";

export default async function getToJsonSchemaFn(): Promise<ToJsonSchemaFn> {
  try {
    const { toJsonSchema } = await import("@valibot/to-json-schema");
    return ((schema, options) =>
      // `valibot` can't describe what a `transform` outputs, so a schema with
      // one is written as the input it accepts, which is all a schema without
      // one has.
      toJsonSchema(schema as never, {
        typeMode: "input",
        ...options,
      })) as ToJsonSchemaFn;
  } catch {
    throw new MissingDependencyError("@valibot/to-json-schema");
  }
}
