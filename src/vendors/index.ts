import {
  type ToJsonSchemaFn,
  UnsupportedVendorError,
  validationMapper,
} from "./utils.js";

export const getToJsonSchemaFn = async (
  vendor: string,
): Promise<ToJsonSchemaFn> => {
  const cached = validationMapper.get(vendor);
  if (cached) {
    return cached;
  }

  let vendorFnPromise: ToJsonSchemaFn | Promise<ToJsonSchemaFn>;

  switch (vendor) {
    case "arktype":
      vendorFnPromise = (await import("./arktype.js")).default();
      break;
    case "effect":
      vendorFnPromise = (await import("./effect.js")).default();
      break;
    case "valibot":
      vendorFnPromise = (await import("./valibot.js")).default();
      break;
    case "zod":
      vendorFnPromise = (await import("./zod.js")).default();
      break;
    default:
      throw new UnsupportedVendorError(vendor);
  }

  const vendorFn = await vendorFnPromise;
  validationMapper.set(vendor, vendorFn);
  return vendorFn;
};
