import type { StandardSchemaV1 } from "@standard-schema/spec";
import { quansync } from "quansync";
import { getToJsonSchemaFn } from "./vendors/index.js";
import {
  fromStandardJsonSchema,
  type ToJsonSchemaFn,
  UnsupportedVendorError,
  validationMapper,
} from "./vendors/utils.js";

/**
 * Converts a Standard Schema to a JSON schema.
 */
export const toJsonSchema = quansync({
  sync: (schema: StandardSchemaV1, options?: Record<string, unknown>) => {
    const vendor = schema["~standard"].vendor;
    const fn = validationMapper.get(vendor) ?? fromStandardJsonSchema(schema);

    if (!fn) {
      throw new UnsupportedVendorError(vendor);
    }

    return fn(schema, options);
  },
  async: async (
    schema: StandardSchemaV1,
    options?: Record<string, unknown>,
  ) => {
    const vendor = schema["~standard"].vendor;
    let fn: ToJsonSchemaFn;
    try {
      fn = await getToJsonSchemaFn(vendor);
    } catch (error) {
      // A schema that carries Standard JSON Schema needs no vendor handler.
      const own = fromStandardJsonSchema(schema);
      if (!own || !(error instanceof UnsupportedVendorError)) {
        throw error;
      }
      fn = own;
    }
    return fn(schema, options);
  },
});

export function loadVendor(vendor: string, fn: ToJsonSchemaFn) {
  validationMapper.set(vendor, fn);
}
