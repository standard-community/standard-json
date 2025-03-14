import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { JSONSchema7 } from "json-schema";

export const toJsonSchema = async (
  schema: StandardSchemaV1,
): Promise<JSONSchema7> => {
  const vendor = schema["~standard"].vendor;

  let mod: Promise<typeof import("./arktype")>;
  switch (vendor) {
    case "arktype":
      mod = import("./arktype");
      break;
    case "valibot":
      mod = import("./valibot");
      break;
    case "zod":
      mod = import("./zod");
      break;
    default:
      throw new Error(`standard-json: Unsupported schema vendor "${vendor}"`);
  }

  return (await (await mod).toJsonSchema())(schema);
};
