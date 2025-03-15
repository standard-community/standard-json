import type { Type } from "arktype";
import type { JSONSchema7 } from "json-schema";

export const toJsonSchema = (schema: Type) =>
  schema.toJsonSchema() as JSONSchema7;
