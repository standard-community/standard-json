import type { JSONSchema7 } from "json-schema";
import { z as z3 } from "zod";
import * as z4 from "zod/v4/core";
import { tryImport, type ToJsonSchemaFn } from "./index.js";

type Schema = z3.ZodTypeAny | z4.$ZodType

export const getToJsonSchemaFn = async (): Promise<ToJsonSchemaFn> => {
  return async (schema, options) => {
    const zodSchema = schema as Schema;

    // Zod 4 or 3
    if ("_zod" in zodSchema) {
      return z4.toJSONSchema(
        zodSchema as z4.$ZodType,
        {
          target: "draft-7",
          io: "input",
          override: (ctx) => {
            // Flattens nested allOfs with intersections
            if (ctx.jsonSchema.allOf) {
              ctx.jsonSchema.allOf = ctx.jsonSchema.allOf.flatMap(schema => 
                schema.allOf ? schema.allOf : [schema]
              );
            }
          }
        }
      ) as JSONSchema7;
    } else {
      const { zodToJsonSchema } = await tryImport(
        import("zod-to-json-schema"),
        "zod-to-json-schema",
      );

      return zodToJsonSchema(
        zodSchema as z3.ZodTypeAny,
        options as Record<string, unknown>,
      ) as JSONSchema7;
    }
  }
};
