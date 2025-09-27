import { MissingDependencyError, type ToJsonSchemaFn } from "./utils.js";

export default async function getToJsonSchemaFn(): Promise<ToJsonSchemaFn> {
  try {
    const { toJSONSchema } = await import("sury");
    return toJSONSchema as ToJsonSchemaFn;
  } catch {
    throw new MissingDependencyError("sury");
  }
}
