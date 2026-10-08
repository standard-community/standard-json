import type { JSONSchema7 } from "json-schema";
export type ToJsonSchemaFn = (
  schema: unknown,
  options?: Record<string, unknown>,
) => JSONSchema7 | Promise<JSONSchema7>;

export const validationMapper = new Map<string, ToJsonSchemaFn>();

export class UnsupportedVendorError extends Error {
  constructor(vendor: string) {
    super(`standard-json: Unsupported schema vendor "${vendor}".`);
  }
}

export class MissingDependencyError extends Error {
  constructor(packageName: string) {
    super(`standard-json: Missing dependencies "${packageName}".`);
  }
}

/**
 * Standard JSON Schema (https://standardschema.dev/json-schema): a schema
 * whose `~standard` carries `jsonSchema.input()` and `jsonSchema.output()`
 * can produce its own JSON Schema, whatever its vendor. Returns a converter
 * for such a schema, or null when the schema does not carry one.
 */
export function fromStandardJsonSchema(schema: unknown): ToJsonSchemaFn | null {
  const std = (schema as { "~standard"?: { jsonSchema?: unknown } } | null)?.[
    "~standard"
  ];
  const jsonSchema = std?.jsonSchema as
    | {
        input?: (options: {
          target: string;
          libraryOptions?: unknown;
        }) => unknown;
      }
    | undefined;
  if (typeof jsonSchema?.input !== "function") {
    return null;
  }
  return (_schema, options) => {
    const target =
      typeof options?.target === "string" ? options.target : "draft-2020-12";
    return jsonSchema.input({ target, libraryOptions: options }) as JSONSchema7;
  };
}
