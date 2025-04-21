import type { JSONSchema7 } from "json-schema";
import { zodToJsonSchema } from "zod-to-json-schema";
import type * as z from "zod";

export const toJsonSchema = (
  schema: z.ZodType,
  options?: Record<string, unknown>,
) => zodToJsonSchema(schema, options) as JSONSchema7;
