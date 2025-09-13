import { describe, expect, it } from "vitest";
import { type ZodTypeAny, z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { loadVendor, toJsonSchema } from "~/index.js";
import type { ToJsonSchemaFn } from "~/vendors/utils.js";

describe("sync check", () => {
  it("zodv3", () => {
    // Loading the vendor
    loadVendor("zod", ((schema, options) =>
      zodToJsonSchema(schema as ZodTypeAny, options)) as ToJsonSchemaFn);

    const zod3Schema = z
      .object({
        myString: z.string(),
        myUnion: z.union([z.number(), z.boolean()]),
      })
      .describe("My neat object schema");

    const zod3JsonSchema = toJsonSchema.sync(zod3Schema);
    expect(zod3JsonSchema).toMatchSnapshot();
  });
});
