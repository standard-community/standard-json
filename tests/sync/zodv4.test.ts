import { describe, expect, it } from "vitest";
import { z } from "zod/v4";
import { type $ZodType, toJSONSchema } from "zod/v4/core";
import { loadVendor, toJsonSchema } from "~/index.js";
import type { ToJsonSchemaFn } from "~/vendors/utils.js";

describe("sync check", () => {
  it("zodv4", () => {
    // Loading the vendor
    loadVendor("zod", ((schema, options) =>
      toJSONSchema(schema as $ZodType, options)) as ToJsonSchemaFn);

    const zod4Schema = z
      .object({
        myString: z.string(),
        myUnion: z.union([z.number(), z.boolean()]),
      })
      .describe("My neat object schema");

    const zod4JsonSchema = toJsonSchema(zod4Schema);
    expect(zod4JsonSchema).toMatchSnapshot();
  });
});
