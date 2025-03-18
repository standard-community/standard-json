import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { JSONSchema7 } from "json-schema";

export const toJsonSchema = async (
  schema: StandardSchemaV1,
  options?: Record<string, unknown>,
): Promise<JSONSchema7> => {
  const vendor = schema["~standard"].vendor;

  let mod: Promise<{
    toJsonSchema: (
      schema: any,
      options?: Record<string, unknown>,
    ) => JSONSchema7;
  }>;
  switch (vendor) {
    case "arktype":
      mod = import("./arktype.js");
      break;
    case "effect":
      mod = import("./effect.js");
      break;
    case "valibot":
      mod = import("./valibot.js");
      break;
    case "zod":
      mod = import("./zod.js");
      break;
    default:
      throw new Error(`standard-json: Unsupported schema vendor "${vendor}"`);
  }

  return (await mod).toJsonSchema(schema, options);
};
