import type { StandardSchemaV1 } from "@standard-schema/spec";
import Type12 from "typebox-1.2";
import { Compile as Compile12 } from "typebox-1.2/compile";
import Type, { type TSchema } from "typebox-1.3";
import { Compile } from "typebox-1.3/compile";
import { Validator } from "typebox-1.3/schema";
import { describe, expect, it } from "vitest";

import { toJsonSchema } from "~/index.js";

const schema = Type.Object(
  {
    myString: Type.String(),
    myUnion: Type.Union([Type.Number(), Type.Boolean()]),
  },
  { description: "My neat object schema" },
);

const jsonSchema = {
  description: "My neat object schema",
  properties: {
    myString: { type: "string" },
    myUnion: { anyOf: [{ type: "number" }, { type: "boolean" }] },
  },
  required: ["myString", "myUnion"],
  type: "object",
};

// The shape of the Standard Schema adapter `typebox` points to.
const toStandardSchema = (type: TSchema) => {
  const validator = new Validator({}, type);
  return {
    "~standard": {
      jsonSchema: {
        input: () => validator.Schema(),
        output: () => validator.Schema(),
      },
      validate: (value: unknown) =>
        validator.Check(value)
          ? { value }
          : {
              issues: validator
                .Errors(value)[1]
                .map(({ message }) => ({ message })),
            },
      vendor: "typebox",
      version: 1,
    },
  } as StandardSchemaV1;
};

describe("typebox 1.0.28 and later", () => {
  it("typebox 1.0.28 to 1.2", async () => {
    const schema = Type12.Object(
      {
        myString: Type12.String(),
        myUnion: Type12.Union([Type12.Number(), Type12.Boolean()]),
      },
      { description: "My neat object schema" },
    );

    expect(await toJsonSchema(Compile12(schema))).toEqual(jsonSchema);
  });

  it("typebox 1.3 and later", async () => {
    expect(await toJsonSchema(Compile(schema))).toEqual(jsonSchema);
  });

  it("typebox 1.3 and later synchronously once it's loaded", async () => {
    await toJsonSchema(Compile(schema));

    expect(toJsonSchema.sync(Compile(schema))).toEqual(jsonSchema);
  });

  it("typebox through its Standard Schema adapter", async () => {
    expect(await toJsonSchema(toStandardSchema(schema))).toEqual(jsonSchema);
  });
});
