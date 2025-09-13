import { toJsonSchema as valibotToJsonSchema } from "@valibot/to-json-schema";
import * as v from "valibot";
import { describe, expect, it } from "vitest";

import { loadVendor, toJsonSchema } from "~/index.js";
import type { ToJsonSchemaFn } from "~/vendors/utils.js";

describe("sync check", () => {
  it("valibot", () => {
    // Loading the vendor
    loadVendor("valibot", valibotToJsonSchema as ToJsonSchemaFn);

    const schema = v.pipe(
      v.object({
        myString: v.string(),
        myUnion: v.union([v.number(), v.boolean()]),
      }),
      v.description("My neat object schema"),
    );

    const jsonSchema = toJsonSchema.sync(schema);
    expect(jsonSchema).toMatchSnapshot();
  });
});
