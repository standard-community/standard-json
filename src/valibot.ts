import type { JSONSchema7 } from "json-schema";
import { toJsonSchema as vToJsonSchema } from "@valibot/to-json-schema";
import type { BaseSchema } from "valibot";

export const toJsonSchema = (schema: BaseSchema<any, any, any>) =>
  vToJsonSchema(schema) as JSONSchema7;
