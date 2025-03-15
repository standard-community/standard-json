import { JSONSchema, type Schema } from "effect";
import type { JSONSchema7 } from "json-schema";

export const toJsonSchema = (schema: Schema.Schema<any, any, never>) =>
  JSONSchema.make(schema) as JSONSchema7;
