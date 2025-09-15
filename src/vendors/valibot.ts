import { MissingDependencyError, type ToJsonSchemaFn } from "./utils.js";

export default async function getToJsonSchemaFn(): Promise<ToJsonSchemaFn> {
  try {
    const { toJsonSchema } = await import("@valibot/to-json-schema");
    return toJsonSchema as ToJsonSchemaFn;
  } catch {
    throw new MissingDependencyError("@valibot/to-json-schema");
  }
}
