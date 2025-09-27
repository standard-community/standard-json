import { type } from "arktype";
import { Schema } from "effect";
import Type from "typebox";
import { Compile } from "typebox/compile";
import * as v from "valibot";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { z as z4 } from "zod/v4";
import { z as zm } from "zod/v4-mini";

import { toJsonSchema } from "~/index.js";

describe("basic", () => {
  it("arktype", async () => {
    const schema = type({
      myString: "string",
      myUnion: "number | boolean",
    }).describe("My neat object schema");

    const jsonSchema = await toJsonSchema(schema);
    expect(jsonSchema).toMatchSnapshot();
  });

  it("effect", async () => {
    const schema = Schema.Struct({
      myString: Schema.String,
      myUnion: Schema.Union(Schema.Number, Schema.Boolean),
    });

    const jsonSchema = await toJsonSchema(Schema.standardSchemaV1(schema));
    expect(jsonSchema).toMatchSnapshot();
  });

  it("typebox", async () => {
    const schema = Type.Object(
      {
        myString: Type.String(),
        myUnion: Type.Union([Type.Number(), Type.Boolean()]),
      },
      { description: "My neat object schema" },
    );

    const jsonSchema = await toJsonSchema(Compile(schema));

    expect(jsonSchema).toMatchSnapshot();
  });

  it("valibot", async () => {
    const schema = v.pipe(
      v.object({
        myString: v.string(),
        myUnion: v.union([v.number(), v.boolean()]),
      }),
      v.description("My neat object schema"),
    );

    const jsonSchema = await toJsonSchema(schema);
    expect(jsonSchema).toMatchSnapshot();
  });

  it("zod", async () => {
    const zod4Schema = z4
      .object({
        myString: z4.string(),
        myUnion: z4.union([z4.number(), z4.boolean()]),
      })
      .describe("My neat object schema");

    const zod4JsonSchema = await toJsonSchema(zod4Schema);
    expect(zod4JsonSchema).toMatchSnapshot();

    const zod3Schema = z
      .object({
        myString: z.string(),
        myUnion: z.union([z.number(), z.boolean()]),
      })
      .describe("My neat object schema");

    const zod3JsonSchema = await toJsonSchema(zod3Schema);
    expect(zod3JsonSchema).toMatchSnapshot();

    const zodMiniSchema = zm.object({
      myString: zm.string(),
      myUnion: zm.union([zm.number(), zm.boolean()]),
    });

    const zodMiniJsonSchema = await toJsonSchema(zodMiniSchema);
    expect(zodMiniJsonSchema).toMatchSnapshot();
  });
});
