import { errorMessageWrapper, type ToJsonSchemaFn } from "./utils.js";

export default async function getToJsonSchemaFn(): Promise<ToJsonSchemaFn> {
  const { toJsonSchema } = await import("@valibot/to-json-schema").catch(() => {
    throw new Error(
      errorMessageWrapper('Missing dependencies "@valibot/to-json-schema".'),
    );
  });
  return toJsonSchema as ToJsonSchemaFn;
}
