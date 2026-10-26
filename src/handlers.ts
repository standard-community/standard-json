import type { StandardSchemaV1 } from "@standard-schema/spec";
import { quansync } from "quansync";
import { getToJsonSchemaFn } from "./vendors/index.js";
import {
  type ToJsonSchemaFn,
  UnsupportedVendorError,
  validationMapper,
} from "./vendors/utils.js";

type TypeBoxValidator = {
  Check: (value: unknown) => unknown;
  Errors: (value: unknown) => unknown;
  Type: () => unknown;
};

// `typebox` dropped Standard Schema in 1.0.28, so a validator from its
// `Compile` no longer carries `~standard` and is recognised by its methods.
const isTypeBoxValidator = (schema: object): schema is TypeBoxValidator =>
  !("~standard" in schema) &&
  ["Check", "Errors", "Type"].every(
    (method) =>
      typeof (schema as Record<string, unknown>)[method] === "function",
  );

const vendorOf = (schema: StandardSchemaV1 | TypeBoxValidator) =>
  isTypeBoxValidator(schema) ? "typebox" : schema["~standard"].vendor;

/**
 * Converts a Standard Schema to a JSON schema.
 */
export const toJsonSchema = quansync({
  sync: (
    schema: StandardSchemaV1 | TypeBoxValidator,
    options?: Record<string, unknown>,
  ) => {
    const vendor = vendorOf(schema);
    const fn = validationMapper.get(vendor);

    if (!fn) {
      throw new UnsupportedVendorError(vendor);
    }

    return fn(schema, options);
  },
  async: async (
    schema: StandardSchemaV1 | TypeBoxValidator,
    options?: Record<string, unknown>,
  ) => {
    const fn = await getToJsonSchemaFn(vendorOf(schema));
    return fn(schema, options);
  },
});

export function loadVendor(vendor: string, fn: ToJsonSchemaFn) {
  validationMapper.set(vendor, fn);
}
