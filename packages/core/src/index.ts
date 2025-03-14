import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { JSONSchema7 } from "json-schema";

export const toJsonSchema = async (
  schema: StandardSchemaV1,
): Promise<JSONSchema7> => {
  const vendor = schema["~standard"].vendor;

  let path: string;
  switch (vendor) {
    case "arktype":
    case "valibot":
    case "zod":
      path = `./${vendor}`;
      break;
    default:
      throw new Error(`standard-json: Unsupported schema vendor "${vendor}"`);
  }

  return await (await import(path)).toJsonSchema(schema);
};
