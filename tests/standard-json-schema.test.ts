import type { StandardSchemaV1 } from "@standard-schema/spec";
import { describe, expect, it } from "vitest";
import { z } from "zod/v4";

import { toJsonSchema } from "~/index.js";

// A schema from a library standard-json does not know, carrying Standard
// JSON Schema (https://standardschema.dev/json-schema) on `~standard`: its
// input and output differ, as they do for a schema that transforms.
function ownSchema() {
  const calls: { side: string; options: unknown }[] = [];
  const document = (side: string, type: string) => ({
    type: "object",
    properties: { quantity: { type } },
    required: ["quantity"],
    $comment: side,
  });
  const schema = {
    "~standard": {
      version: 1,
      vendor: "example-with-json-schema",
      validate: (value: unknown) => ({ value }),
      jsonSchema: {
        input: (options: unknown) => {
          calls.push({ side: "input", options });
          return document("input", "string");
        },
        output: (options: unknown) => {
          calls.push({ side: "output", options });
          return document("output", "number");
        },
      },
    },
  } as unknown as StandardSchemaV1;
  return { schema, calls };
}

describe("standard json schema", () => {
  it("converts a schema that carries its own JSON Schema, async", async () => {
    const { schema, calls } = ownSchema();
    const jsonSchema = await toJsonSchema(schema);
    expect(jsonSchema).toMatchObject({
      type: "object",
      required: ["quantity"],
      $comment: "input",
    });
    expect(calls).toEqual([
      {
        side: "input",
        options: { target: "draft-2020-12", libraryOptions: undefined },
      },
    ]);
  });

  it("converts a schema that carries its own JSON Schema, sync", () => {
    const { schema, calls } = ownSchema();
    const jsonSchema = toJsonSchema.sync(schema);
    expect(jsonSchema).toMatchObject({ $comment: "input" });
    expect(calls).toHaveLength(1);
  });

  it.each(["input", "output"] as const)(
    "converts the %s when io asks for it, async and sync",
    async (io) => {
      const { schema, calls } = ownSchema();
      const type = io === "input" ? "string" : "number";
      expect(await toJsonSchema(schema, { io })).toMatchObject({
        $comment: io,
        properties: { quantity: { type } },
      });
      expect(toJsonSchema.sync(schema, { io })).toMatchObject({
        $comment: io,
        properties: { quantity: { type } },
      });
      expect(calls.map((call) => call.side)).toEqual([io, io]);
    },
  );

  it("passes the target and the options through", async () => {
    const { schema, calls } = ownSchema();
    await toJsonSchema(schema, { target: "draft-07", io: "output", x: 1 });
    expect(calls[0]).toEqual({
      side: "output",
      options: {
        target: "draft-07",
        libraryOptions: { target: "draft-07", io: "output", x: 1 },
      },
    });
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

  it("leaves a built-in vendor to its handler, cold and warm", async () => {
    // A real zod schema given a `jsonSchema` of its own that answers
    // differently from zod's handler. The handler must win on every entry,
    // whether or not the async one has loaded it yet.
    const schema = z.object({ quantity: z.number().default(1) });
    const carried = {
      ...schema["~standard"],
      jsonSchema: {
        input: () => ({ $comment: "carried" }),
        output: () => ({ $comment: "carried" }),
      },
    };
    Object.defineProperty(schema, "~standard", { value: carried });

    // Cold: the handler is not loaded, and the carried schema is not a
    // substitute for it.
    expect(() => toJsonSchema.sync(schema)).toThrow(
      'Unsupported schema vendor "zod"',
    );

    const fromHandler = await toJsonSchema(schema);
    expect(fromHandler).not.toHaveProperty("$comment");
    expect(fromHandler).toMatchObject({
      properties: { quantity: { type: "number", default: 1 } },
    });

    // Warm: the same answer from the sync entry.
    expect(toJsonSchema.sync(schema)).toEqual(fromHandler);
  });
});
