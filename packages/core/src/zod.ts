import type { JSONSchema7 } from "json-schema";
import { zodToJsonSchema } from "zod-to-json-schema";
import type * as z from "zod";

export const toJsonSchema = (schema: z.ZodType) =>
  zodToJsonSchema(schema) as JSONSchema7;
