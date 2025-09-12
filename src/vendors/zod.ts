import type { ZodTypeAny } from "zod/v3";
import type { $ZodType } from "zod/v4/core";
import { errorMessageWrapper, type ToJsonSchemaFn } from "./utils.js";

export default async function getToJsonSchemaFn(): Promise<ToJsonSchemaFn> {
  return async (schema, options) => {
    let handler: ToJsonSchemaFn;

    // https://zod.dev/library-authors?id=how-to-support-zod-and-zod-mini-simultaneously#how-to-support-zod-3-and-zod-4-simultaneously
    if ("_zod" in (schema as $ZodType | ZodTypeAny)) {
      try {
        handler = await import("zod/v4/core").then(
          (mod) => mod.toJSONSchema as ToJsonSchemaFn,
        );
      } catch {
        throw new Error(errorMessageWrapper('Missing dependencies "zod v4".'));
      }
    } else {
      try {
        handler = await import("zod-to-json-schema").then(
          (mod) => mod.zodToJsonSchema as ToJsonSchemaFn,
        );
      } catch {
        throw new Error(
          errorMessageWrapper('Missing dependencies "zod-to-json-schema".'),
        );
      }
    }

    return handler(schema, options);
  };
}
