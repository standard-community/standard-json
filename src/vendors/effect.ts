import type { Schema } from "effect";
import type { JSONSchema7 } from "json-schema";
import { ioOf, MissingDependencyError, type ToJsonSchemaFn } from "./utils.js";

type JsonSchemaDocument = {
  definitions: Record<string, JSONSchema7>;
  schema: JSONSchema7;
};

// The part of `effect` 4 the handler uses, as the types it's built against
// are those of `effect` 3.
type Effect4 = {
  JsonSchema: {
    META_SCHEMA_URI_DRAFT_07: string;
    toDocumentDraft07: (document: JsonSchemaDocument) => JsonSchemaDocument;
  };
  Schema: {
    toJsonSchemaDocument: (schema: unknown) => JsonSchemaDocument;
  };
};

export default async function getToJsonSchemaFn(): Promise<ToJsonSchemaFn> {
  try {
    const effect = await import("effect");

    // `effect` 4 replaced the `JSONSchema` module with `JsonSchema`.
    if ("JSONSchema" in effect) {
      const { JSONSchema } = effect;
      return (schema, options) => {
        const io = ioOf(options);
        const side = schema as Schema.Schema<unknown>;
        // `encodedSchema` drops every refinement, so a schema that doesn't
        // transform would lose its constraints. `encodedBoundSchema` keeps
        // those before the first transformation.
        return JSONSchema.make(
          io === "input"
            ? effect.Schema.encodedBoundSchema(side)
            : io === "output"
              ? effect.Schema.typeSchema(side)
              : side,
        ) as JSONSchema7;
      };
    }

    const { JsonSchema, Schema } = effect as unknown as Effect4;
    return (schema) => {
      // `effect` 4 writes draft 2020-12. Converting it to draft-07, which
      // `effect` 3 writes, keeps the dialect the same across both versions.
      // The converted `$ref`s point to `#/definitions/`, so that's where the
      // definitions go.
      const { definitions, schema: jsonSchema } = JsonSchema.toDocumentDraft07(
        Schema.toJsonSchemaDocument(schema),
      );
      return {
        $schema: JsonSchema.META_SCHEMA_URI_DRAFT_07,
        ...jsonSchema,
        ...(Object.keys(definitions).length > 0 && { definitions }),
      };
    };
  } catch {
    throw new MissingDependencyError("effect");
  }
}
