import type { StandardSchemaV1 } from "@standard-schema/spec";
import { quansync } from "quansync";
import { getToJsonSchemaFn } from "./vendors/index.js";
import {
  errorMessageWrapper,
  type ToJsonSchemaFn,
  validationMapper,
} from "./vendors/utils.js";

/**
 * Converts a Standard Schema to a JSON schema.
 */
export const toJsonSchema = quansync({
  sync: (schema: StandardSchemaV1, options?: Record<string, unknown>) => {
    const fn = validationMapper.get(schema["~standard"].vendor);

    if (!fn) {
      throw new Error(
        errorMessageWrapper(
          `Unsupported schema vendor "${schema["~standard"].vendor}".`,
        ),
      );
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
