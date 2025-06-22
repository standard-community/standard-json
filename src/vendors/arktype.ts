import type { Type } from "arktype";
import type { JSONSchema7 } from "json-schema";
import type { ToJsonSchemaFn } from "./utils.js";

const getToJsonSchemaFn = async (): Promise<ToJsonSchemaFn> => (schema) =>
  (schema as Type).toJsonSchema() as JSONSchema7;

export default getToJsonSchemaFn;
