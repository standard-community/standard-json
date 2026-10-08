import type { StandardSchemaV1 } from "@standard-schema/spec";
import { quansync } from "quansync";
import { builtInVendors, getToJsonSchemaFn } from "./vendors/index.js";
import {
  fromStandardJsonSchema,
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

// A schema from a vendor with no handler, built in or registered, converts
// through the Standard JSON Schema it carries, when it carries one. A
// built-in vendor never takes that route, so the sync entry answers the same
// before and after the async one has loaded the handler.
const ownConverter = (
  vendor: string,
  schema: StandardSchemaV1 | TypeBoxValidator,
): ToJsonSchemaFn | null =>
  builtInVendors.has(vendor) ? null : fromStandardJsonSchema(schema);

/**
 * Converts a Standard Schema to a JSON schema.
 */
export const toJsonSchema = quansync({
  sync: (
    schema: StandardSchemaV1 | TypeBoxValidator,
    options?: Record<string, unknown>,
  ) => {
    const vendor = vendorOf(schema);
    const fn = validationMapper.get(vendor) ?? ownConverter(vendor, schema);

    if (!fn) {
      throw new UnsupportedVendorError(vendor);
    }

    return fn(schema, options);
  },
  async: async (
    schema: StandardSchemaV1 | TypeBoxValidator,
    options?: Record<string, unknown>,
  ) => {
    const vendor = vendorOf(schema);
    const fn =
      validationMapper.get(vendor) ??
      ownConverter(vendor, schema) ??
      (await getToJsonSchemaFn(vendor));
    return fn(schema, options);
  },
});

export function loadVendor(vendor: string, fn: ToJsonSchemaFn) {
  validationMapper.set(vendor, fn);
}
