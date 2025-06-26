import getArktypeToJsonSchemaFn from "./arktype.js";
import getEffectToJsonSchemaFn from "./effect.js";
import { errorMessageWrapper, type ToJsonSchemaFn } from "./utils.js";
import getValibotToJsonSchemaFn from "./valibot.js";
import getZodToJsonSchemaFn from "./zod.js";

const vendorToFn: Record<string, () => Promise<ToJsonSchemaFn>> = {
  arktype: getArktypeToJsonSchemaFn,
  effect: getEffectToJsonSchemaFn,
  valibot: getValibotToJsonSchemaFn,
  zod: getZodToJsonSchemaFn,
};

export const getToJsonSchemaFn = (vendor: string): Promise<ToJsonSchemaFn> => {
  const venderConvertor = vendorToFn[vendor];

  if (!venderConvertor)
    throw new Error(
      errorMessageWrapper(`Unsupported schema vendor "${vendor}"`),
    );

  return venderConvertor();
};
