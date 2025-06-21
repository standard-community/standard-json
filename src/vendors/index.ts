import type { JSONSchema7 } from "json-schema";

export type ToJsonSchemaFn = (
  schema: unknown,
  options?: unknown,
) => JSONSchema7 | Promise<JSONSchema7>;

export const tryImport = async <T>(
  result: Promise<T>,
  name: string,
): Promise<Awaited<T>> => {
  try {
    return await result;
  } catch {
    throw new Error(`standard-json: Missing dependencies "${name}".`);
  }
};

export const getToJsonSchemaFn = async (
  vendor: string,
): Promise<ToJsonSchemaFn> => {
  switch (vendor) {
    case "arktype":
      return import("./arktype.js").then(async ({ getToJsonSchemaFn }) =>
        getToJsonSchemaFn(),
      );
    case "effect":
      return import("./effect.js").then(async ({ getToJsonSchemaFn }) =>
        getToJsonSchemaFn(),
      );
    case "valibot":
      return import("./valibot.js").then(async ({ getToJsonSchemaFn }) =>
        getToJsonSchemaFn(),
      );
    case "zod":
      return import("./zod.js").then(async ({ getToJsonSchemaFn }) =>
        getToJsonSchemaFn(),
      );
    default:
      throw new Error(`standard-json: Unsupported schema vendor "${vendor}"`);
  }
};
