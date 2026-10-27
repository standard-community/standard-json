import type { JSONSchema7 } from "json-schema";
import type { Validator } from "typebox/compile";
import type { ToJsonSchemaFn } from "./utils.js";

type WithStandardJsonSchema = {
  "~standard": {
    jsonSchema: { input: (options: { target: string }) => unknown };
  };
};

export default function getToJsonSchemaFn(): ToJsonSchemaFn {
  return (schema) => {
    // From 1.0.28, `typebox` points to a Standard Schema adapter to copy,
    // which carries Standard JSON Schema instead of being a `Validator`.
    const jsonSchema = (schema as Partial<WithStandardJsonSchema>)["~standard"]
      ?.jsonSchema;
    const type = jsonSchema
      ? jsonSchema.input({ target: "draft-2020-12" })
      : (schema as Validator).Type();
    return JSON.parse(JSON.stringify(type)) as JSONSchema7;
  };
}
