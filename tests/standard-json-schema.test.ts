import type { StandardSchemaV1 } from "@standard-schema/spec";
import { describe, expect, it } from "vitest";

import { toJsonSchema } from "~/index.js";

// A schema from a library standard-json does not know, carrying Standard
// JSON Schema (https://standardschema.dev/json-schema) on `~standard`.
function ownSchema(target?: string) {
  const document = {
    type: "object",
    properties: { name: { type: "string", minLength: 1 } },
    required: ["name"],
  };
  const calls: unknown[] = [];
  const schema = {
    "~standard": {
      version: 1,
      vendor: "example-with-json-schema",
      validate: (value: unknown) => ({ value }),
      jsonSchema: {
        input: (options: unknown) => {
          calls.push(options);
          return { ...document, $comment: `input for ${target ?? "default"}` };
        },
        output: () => document,
      },
    },
  } as unknown as StandardSchemaV1;
  return { schema, document, calls };
}

describe("standard json schema", () => {
  it("converts a schema that carries its own JSON Schema, async", async () => {
    const { schema, calls } = ownSchema();
    const jsonSchema = await toJsonSchema(schema);
    expect(jsonSchema).toMatchObject({ type: "object", required: ["name"] });
    expect(calls).toEqual([
      { target: "draft-2020-12", libraryOptions: undefined },
    ]);
  });

  it("converts a schema that carries its own JSON Schema, sync", () => {
    const { schema, calls } = ownSchema();
    const jsonSchema = toJsonSchema.sync(schema);
    expect(jsonSchema).toMatchObject({ type: "object", required: ["name"] });
    expect(calls).toHaveLength(1);
  });

  it("passes the target through", async () => {
    const { schema, calls } = ownSchema("draft-07");
    await toJsonSchema(schema, { target: "draft-07" });
    expect(calls[0]).toMatchObject({ target: "draft-07" });
  });

  it("still rejects a vendor it does not know when no JSON Schema is carried", async () => {
    const schema = {
      "~standard": {
        version: 1,
        vendor: "unknown-lib",
        validate: (value: unknown) => ({ value }),
      },
    } as unknown as StandardSchemaV1;
    await expect(toJsonSchema(schema)).rejects.toThrow(
      'Unsupported schema vendor "unknown-lib"',
    );
    expect(() => toJsonSchema.sync(schema)).toThrow(
      'Unsupported schema vendor "unknown-lib"',
    );
  });
});
