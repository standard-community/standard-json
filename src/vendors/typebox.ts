import type { JSONSchema7 } from "json-schema";
import type { Validator } from "typebox/compile";
import type { ToJsonSchemaFn } from "./utils.js";

export default function getToJsonSchemaFn(): ToJsonSchemaFn {
  return (schema) =>
    JSON.parse(JSON.stringify((schema as Validator).Type())) as JSONSchema7;
}
