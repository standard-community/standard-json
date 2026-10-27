import * as S from "sury-11";
import { describe, expect, it, vi } from "vitest";

import { toJsonSchema } from "~/index.js";

// `sury` 10 is the one installed as `sury`, so the handler is given 11.x.
vi.mock("sury", () => import("sury-11"));

describe("sury 11", () => {
  it("sury", async () => {
    const schema = S.schema({
      myString: S.string,
      myUnion: S.union([S.number, S.boolean]),
    }).with(S.meta, { description: "My neat object schema" });

    const jsonSchema = await toJsonSchema(schema);
    expect(jsonSchema).toEqual({
      description: "My neat object schema",
      properties: {
        myString: { type: "string" },
        myUnion: { anyOf: [{ type: "number" }, { type: "boolean" }] },
      },
      required: ["myString", "myUnion"],
      type: "object",
    });
  });

  it("sury with a transform", async () => {
    const schema = S.schema({ quantity: S.string.with(S.to, S.number) });

    const jsonSchema = await toJsonSchema(schema);
    expect(jsonSchema).toEqual({
      properties: { quantity: { type: "string" } },
      required: ["quantity"],
      type: "object",
    });
  });
});
