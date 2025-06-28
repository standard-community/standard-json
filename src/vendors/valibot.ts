import { type ToJsonSchemaFn, tryImport } from "./utils.js";

export default async function getToJsonSchemaFn(): Promise<ToJsonSchemaFn> {
  const { toJsonSchema } = await tryImport(
    import("@valibot/to-json-schema"),
    "@valibot/to-json-schema",
  );
  return toJsonSchema as ToJsonSchemaFn;
}
