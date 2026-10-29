import { type } from "arktype";
import { Schema } from "effect";
import S from "sury";
import * as v from "valibot";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { z as z4 } from "zod/v4";

import { toJsonSchema } from "~/index.js";

type Convertible = Parameters<typeof toJsonSchema>[0];

const withoutDialect = ({
  $schema: _,
  ...jsonSchema
}: object & {
  $schema?: unknown;
}) => jsonSchema as Record<string, unknown>;

const convert = async (schema: unknown, options: Record<string, unknown>) =>
  withoutDialect(await toJsonSchema(schema as Convertible, options));

// `toJsonSchema.sync` needs the vendor's handler, which `toJsonSchema` loads.
const convertSync = async (
  schema: unknown,
  options: Record<string, unknown>,
) => {
  await toJsonSchema(schema as Convertible);
  return withoutDialect(toJsonSchema.sync(schema as Convertible, options));
};

describe("io", () => {
  it.each([
    [
      "arktype",
      type({ quantity: type("string").pipe(Number) }),
      { quantity: { type: "string" } },
      { quantity: {} },
    ],
    [
      "sury",
      S.schema({ quantity: S.to(S.string, S.number) }),
      { quantity: { type: "string" } },
      { quantity: { type: "number" } },
    ],
    [
      "valibot",
      v.object({
        quantity: v.pipe(v.string(), v.transform(Number), v.number()),
      }),
      { quantity: { type: "string" } },
      { quantity: { type: "number" } },
    ],
    [
      "zod 3",
      z.object({ quantity: z.string().pipe(z.coerce.number()) }),
      { quantity: { type: "string" } },
      { quantity: { type: "number" } },
    ],
    [
      "zod 3 with a transform",
      z.object({ quantity: z.string().transform(Number) }),
      { quantity: { type: "string" } },
      { quantity: {} },
    ],
  ])(
    "converts the input or the output of %s",
    async (_, schema, input, output) => {
      expect((await convert(schema, { io: "input" })).properties).toEqual(
        input,
      );
      expect((await convert(schema, { io: "output" })).properties).toEqual(
        output,
      );
    },
  );

  it("converts the input or the output of effect", async () => {
    const schema = Schema.standardSchemaV1(
      Schema.Struct({
        quantity: Schema.NumberFromString,
        size: Schema.optionalWith(Schema.String, { default: () => "small" }),
      }),
    );

    expect(await convert(schema, { io: "input" })).toMatchObject({
      properties: { quantity: { type: "string" }, size: { type: "string" } },
      required: ["quantity"],
    });
    expect(await convert(schema, { io: "output" })).toMatchObject({
      properties: { quantity: { type: "number" }, size: { type: "string" } },
      required: ["quantity", "size"],
    });
  });

  it.each([
    ["toJsonSchema", convert],
    ["toJsonSchema.sync", convertSync],
  ])("keeps the refinements of effect in the input with %s", async (_, run) => {
    const Name = Schema.String.pipe(Schema.minLength(3));
    const Quantity = Schema.Number.pipe(Schema.positive());
    const name = { minLength: 3, type: "string" };
    const quantity = { exclusiveMinimum: 0, type: "number" };
    const input = <A, I>(schema: Schema.Schema<A, I>) =>
      run(Schema.standardSchemaV1(schema), { io: "input" });

    expect(await input(Name)).toMatchObject(name);
    expect(await input(Quantity)).toMatchObject(quantity);
    expect(
      await input(Schema.Struct({ name: Name, quantity: Quantity })),
    ).toMatchObject({ properties: { name, quantity } });
    expect(
      await input(Schema.compose(Name, Schema.NumberFromString)),
    ).toMatchObject(name);
  });

  it("converts the input or the output of zod 4", async () => {
    const schema = z4.object({ size: z4.string().default("small") });

    expect(await convert(schema, { io: "input" })).not.toHaveProperty(
      "required",
    );
    expect(await convert(schema, { io: "output" })).toMatchObject({
      required: ["size"],
    });
  });

  it("keeps a zod 3 refinement in the output", async () => {
    const schema = z.object({ name: z.string().refine((name) => name !== "") });

    expect((await convert(schema, { io: "output" })).properties).toEqual({
      name: { type: "string" },
    });
  });

  it("keeps the description of a zod 3 transform in the output", async () => {
    const schema = z.object({
      quantity: z.string().transform(Number).describe("Number of pets"),
    });

    expect((await convert(schema, { io: "output" })).properties).toEqual({
      quantity: { description: "Number of pets" },
    });
  });

  it("post-processes a zod 3 transform in the output", async () => {
    const schema = z.object({ quantity: z.string().transform(Number) });
    const postProcess = (jsonSchema: object | undefined) =>
      jsonSchema && { ...jsonSchema, readOnly: true };

    expect(
      (await convert(schema, { io: "output", postProcess })).properties,
    ).toEqual({ quantity: { readOnly: true } });
  });

  it.each([
    [
      "valibot",
      v.object({
        quantity: v.pipe(v.string(), v.transform(Number), v.number()),
      }),
      { typeMode: "input" },
    ],
    [
      "zod 3",
      z.object({ quantity: z.string().pipe(z.coerce.number()) }),
      { pipeStrategy: "input" },
    ],
    [
      "zod 3 with a transform",
      z.object({ quantity: z.string().transform(Number) }),
      { effectStrategy: "input" },
    ],
  ])("lets the own option of %s win over io", async (_, schema, own) => {
    expect(await convert(schema, { io: "output", ...own })).toMatchObject({
      properties: { quantity: { type: "string" } },
    });
  });
});
