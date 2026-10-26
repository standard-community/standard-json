import { Schema } from "effect-4";
import { describe, expect, it, vi } from "vitest";

import { toJsonSchema } from "~/index.js";

// `effect` 3 is the one installed as `effect`, so the handler is given 4.x.
vi.mock("effect", () => import("effect-4"));

describe("effect 4", () => {
  it("effect", async () => {
    const schema = Schema.Struct({
      myString: Schema.String,
      myUnion: Schema.Union([Schema.Finite, Schema.Boolean]),
    });

    const jsonSchema = await toJsonSchema(Schema.toStandardSchemaV1(schema));
    expect(jsonSchema).toEqual({
      $schema: "http://json-schema.org/draft-07/schema#",
      additionalProperties: true,
      properties: {
        myString: { type: "string" },
        myUnion: { anyOf: [{ type: "number" }, { type: "boolean" }] },
      },
      required: ["myString", "myUnion"],
      type: "object",
    });
  });

  it("effect with a definition", async () => {
    const Tag = Schema.String.annotate({ identifier: "Tag" });
    const schema = Schema.Struct({ tags: Schema.Array(Tag) });

    const jsonSchema = await toJsonSchema(Schema.toStandardSchemaV1(schema));
    expect(jsonSchema).toEqual({
      $schema: "http://json-schema.org/draft-07/schema#",
      additionalProperties: true,
      definitions: { Tag: { type: "string" } },
      properties: {
        tags: { items: { $ref: "#/definitions/Tag" }, type: "array" },
      },
      required: ["tags"],
      type: "object",
    });
  });
});
