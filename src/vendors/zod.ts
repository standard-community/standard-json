import type { ZodTypeAny } from "zod/v3";
import type { $ZodType } from "zod/v4/core";
import { type ToJsonSchemaFn, tryImport } from "./utils.js";

export default async function getToJsonSchemaFn(): Promise<ToJsonSchemaFn> {
  return async (schema, options) => {
    let handler: ToJsonSchemaFn;

    // https://zod.dev/library-authors?id=how-to-support-zod-and-zod-mini-simultaneously#how-to-support-zod-3-and-zod-4-simultaneously
    if ("_zod" in (schema as $ZodType | ZodTypeAny)) {
      handler = await tryImport(import("zod/v4/core"), "zod v4").then(
        (mod) => mod.toJSONSchema as ToJsonSchemaFn,
      );
    } else {
      handler = await tryImport(import("zod-to-json-schema"), "zod v3").then(
        (mod) => mod.zodToJsonSchema as ToJsonSchemaFn,
      );
    }

    return handler(schema, options);
  };
}
