import { Schema } from "effect";
import { describe, expect, it } from "vitest";

import { toJsonSchema } from "~/index.js";

describe.each(["async", "sync"] as const)(
  "Effect 3 %s input conversion",
  (mode) => {
    const convert = async <A, I>(schema: Schema.Schema<A, I>) => {
      const standard = Schema.standardSchemaV1(schema);
      if (mode === "sync") {
        await toJsonSchema(standard);
        return toJsonSchema.sync(standard, { io: "input" });
      }
      return toJsonSchema(standard, { io: "input" });
    };

    it("describes the string accepted by a top-level JSON parser", async () => {
      const schema = Schema.parseJson(Schema.Struct({ name: Schema.String }));

      expect(await convert(schema)).toMatchObject({
        type: "string",
        contentMediaType: "application/json",
      });
    });

    it("keeps named class definitions and references", async () => {
      class Pet extends Schema.Class<Pet>("Pet")({ name: Schema.String }) {}

      expect(await convert(Schema.Array(Pet))).toMatchObject({
        type: "array",
        items: { $ref: "#/$defs/Pet" },
        $defs: {
          Pet: {
            type: "object",
            properties: { name: { type: "string" } },
            required: ["name"],
          },
        },
      });
    });

    it("keeps identifiers needed by recursive schemas", async () => {
      interface Node {
        name: string;
        next?: Node;
      }
      const Node: Schema.Schema<Node> = Schema.Struct({
        name: Schema.String,
        next: Schema.optional(Schema.suspend(() => Node)),
      }).annotations({ identifier: "Node" });

      expect(await convert(Node)).toMatchObject({
        $ref: "#/$defs/Node",
        $defs: {
          Node: {
            type: "object",
            properties: {
              name: { type: "string" },
              next: { $ref: "#/$defs/Node" },
            },
          },
        },
      });
    });
  },
);
