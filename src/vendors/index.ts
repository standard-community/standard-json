import { errorMessageWrapper, type ToJsonSchemaFn } from "./utils.js";

export const getToJsonSchemaFn = async (
  vendor: string,
): Promise<ToJsonSchemaFn> => {
  switch (vendor) {
    case "arktype":
      return (await import("./arktype.js")).default();
    case "effect":
      return (await import("./effect.js")).default();
    case "valibot":
      return (await import("./valibot.js")).default();
    case "zod":
      return (await import("./zod.js")).default();
    default:
      throw new Error(
        errorMessageWrapper(`Unsupported schema vendor "${vendor}".`),
      );
  }
};
