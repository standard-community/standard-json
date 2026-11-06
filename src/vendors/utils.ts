import type { JSONSchema7 } from "json-schema";
export type ToJsonSchemaFn = (
  schema: unknown,
  options?: Record<string, unknown>,
) => JSONSchema7 | Promise<JSONSchema7>;

export const validationMapper = new Map<string, ToJsonSchemaFn>();

/**
 * The side of a schema `options.io` asks for: what it accepts or what it
 * outputs, which differ for one that transforms or defaults its input.
 */
export const ioOf = (options?: Record<string, unknown>) =>
  options?.io === "input" || options?.io === "output" ? options.io : undefined;

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
 * for such a schema, or null when the schema does not carry one. The
 * converter takes the side `options.io` asks for, the input when it names
 * none, with `options.target` (`draft-2020-12` when none is given) and the
 * other options as the library's own: `io` and `target` are standard-json's,
 * so a library that spreads its options into its config doesn't get them.
 */
export function fromStandardJsonSchema(schema: unknown): ToJsonSchemaFn | null {
  type Convert = (options: {
    target: string;
    libraryOptions?: unknown;
  }) => unknown;
  const std = (schema as { "~standard"?: { jsonSchema?: unknown } } | null)?.[
    "~standard"
  ];
  const jsonSchema = std?.jsonSchema as
    | { input?: unknown; output?: unknown }
    | undefined;
  const input = jsonSchema?.input;
  const output = jsonSchema?.output;
  if (typeof input !== "function" || typeof output !== "function") {
    return null;
  }
  // Called as methods of `jsonSchema`, so one written with `this` still works.
  const sides = jsonSchema as { input: Convert; output: Convert };
  return (_schema, options) => {
    const target =
      typeof options?.target === "string" ? options.target : "draft-2020-12";
    const side = ioOf(options) ?? "input";
    const { io: _io, target: _target, ...rest } = options ?? {};
    const libraryOptions = Object.keys(rest).length > 0 ? rest : undefined;
    return sides[side]({ target, libraryOptions }) as JSONSchema7;
  };
}
