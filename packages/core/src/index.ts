import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { JSONSchema7 } from "json-schema";

import { getToJsonSchemaFn } from "./vendors/index.js";

/**
 * Converts a Standard Schema to a JSON schema.
 */
export const toJsonSchema = async (
  schema: StandardSchemaV1,
): Promise<JSONSchema7> =>
  getToJsonSchemaFn(schema["~standard"].vendor).then(async (toJsonSchema) =>
    await toJsonSchema(schema),
  );
