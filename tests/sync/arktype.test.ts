import { type Type, type } from "arktype";
import { describe, expect, it } from "vitest";

import { loadVendor, toJsonSchema } from "~/index.js";
import type { ToJsonSchemaFn } from "~/vendors/utils.js";

describe("sync check", () => {
  it("arktype", () => {
    // Loading the vendor
    loadVendor("arktype", ((schema, options) =>
      (schema as Type).toJsonSchema(options)) as ToJsonSchemaFn,
    );

    const schema = type({
      myString: "string",
      myUnion: "number | boolean",
    }).describe("My neat object schema");

    const jsonSchema = toJsonSchema(schema);
    expect(jsonSchema).toMatchSnapshot();
  });
});
