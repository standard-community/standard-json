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

  it.each([
    [
      "a transform",
      S.schema({ quantity: S.string.with(S.to, S.number) }),
      { quantity: { type: "string" } },
      { quantity: { type: "number" } },
    ],
    [
      "a refinement before a transform",
      S.schema({
        quantity: S.string.with(S.maxLength, 3).with(S.to, S.number),
      }),
      { quantity: { maxLength: 3, type: "string" } },
      { quantity: { type: "number" } },
    ],
  ])(
    "converts the input or the output of %s",
    async (_, schema, input, output) => {
      expect((await toJsonSchema(schema, { io: "input" })).properties).toEqual(
        input,
      );
      expect((await toJsonSchema(schema, { io: "output" })).properties).toEqual(
        output,
      );
    },
  );

  it("converts the output synchronously", async () => {
    const schema = S.schema({ quantity: S.string.with(S.to, S.number) });
    await toJsonSchema(schema);

    expect(toJsonSchema.sync(schema, { io: "output" })).toMatchObject({
      properties: { quantity: { type: "number" } },
    });
  });
});
