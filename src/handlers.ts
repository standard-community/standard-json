import type { StandardSchemaV1 } from "@standard-schema/spec";
import { quansync } from "quansync";
import { getToJsonSchemaFn } from "./vendors/index.js";
import {
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
    const fn = validationMapper.get(vendor);

    if (!fn) {
      throw new UnsupportedVendorError(vendor);
    }

    return fn(schema, options);
  },
  async: async (
    schema: StandardSchemaV1,
    options?: Record<string, unknown>,
  ) => {
    const fn = await getToJsonSchemaFn(schema["~standard"].vendor);
    return fn(schema, options);
  },
});

export function loadVendor(vendor: string, fn: ToJsonSchemaFn) {
  validationMapper.set(vendor, fn);
}
