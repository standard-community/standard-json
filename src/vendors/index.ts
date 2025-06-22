import getArktypeToJsonSchemaFn from "./arktype.js";
import getEffectToJsonSchemaFn from "./effect.js";
import { errorMessageWrapper, type ToJsonSchemaFn } from "./utils.js";
import getValibotToJsonSchemaFn from "./valibot.js";
import getZodToJsonSchemaFn from "./zod.js";

export const getToJsonSchemaFn = async (
  vendor: string,
): Promise<ToJsonSchemaFn> => {
  switch (vendor) {
    case "arktype":
      return getArktypeToJsonSchemaFn();
    case "effect":
      return getEffectToJsonSchemaFn();
    case "valibot":
      return getValibotToJsonSchemaFn();
    case "zod":
      return getZodToJsonSchemaFn();
    default:
      throw new Error(
        errorMessageWrapper(`Unsupported schema vendor "${vendor}"`),
      );
  }
};
