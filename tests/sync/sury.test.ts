import S from "sury";
import { describe, expect, it } from "vitest";

import { loadVendor, toJsonSchema } from "~/index.js";
import type { ToJsonSchemaFn } from "~/vendors/utils.js";

describe("sync check", () => {
  it("sury", () => {
    // Loading the vendor
    loadVendor("sury", S.toJSONSchema as ToJsonSchemaFn);

    const schema = S.schema({
      myString: S.string,
      myUnion: S.union([S.number, S.boolean]),
    }).with(S.meta, { description: "My neat object schema" });

    const jsonSchema = toJsonSchema.sync(schema);
    expect(jsonSchema).toMatchSnapshot();
  });
});
