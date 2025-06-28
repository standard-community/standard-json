import type { ZodTypeAny } from "zod/v3";
import type { $ZodType } from "zod/v4/core";
import { type ToJsonSchemaFn, tryImport } from "./utils.js";

export default async function getToJsonSchemaFn(): Promise<ToJsonSchemaFn> {
  return async (schema, options) => {
    let handler: ToJsonSchemaFn;

    // https://zod.dev/library-authors?id=how-to-support-zod-and-zod-mini-simultaneously#how-to-support-zod-3-and-zod-4-simultaneously
    if ("_zod" in (schema as $ZodType | ZodTypeAny)) {
      const toJSONSchema = await tryImport(
        import("zod/v4/core"),
        "zod v4",
      ).then((mod) => mod.toJSONSchema);

      // Add flatten override function
      // TODO (kingbri): Unsure how the override should be handled
      // So for now, use this as the default unless the user specifies otherwise
      const createJsonSchema = (
        schema: $ZodType,
        options?: Record<string, unknown>,
      ) =>
        toJSONSchema(schema, {
          override: (ctx) => {
            // Flattens nested allOfs with intersections
            if (ctx.jsonSchema.allOf) {
              ctx.jsonSchema.allOf = ctx.jsonSchema.allOf.flatMap((schema) =>
                schema.allOf ? schema.allOf : [schema],
              );
            }
          },
          ...(options ?? {}),
        });

      handler = createJsonSchema as ToJsonSchemaFn;
    } else {
      handler = await tryImport(import("zod-to-json-schema"), "zod v3").then(
        (mod) => mod.zodToJsonSchema as ToJsonSchemaFn,
      );
    }

    return handler(schema, options);
  };
}
