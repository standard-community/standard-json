import type { JSONSchema7 } from "json-schema";
import type { ZodEffectsDef, ZodTypeAny } from "zod/v3";
import type { $ZodType } from "zod/v4/core";
import type { OverrideCallback } from "zod-to-json-schema";
import { ioOf, MissingDependencyError, type ToJsonSchemaFn } from "./utils.js";

const importIfInstalled = async <T>(load: () => Promise<T>) => {
  try {
    return await load();
  } catch {
    return undefined;
  }
};

// `zod-to-json-schema` writes a `transform` as the input it accepts, which
// needn't describe what it outputs, so the output allows any value there. An
// `override` passed in the options still decides first.
const allowAnyTransformOutput =
  (
    ignoreOverride: ReturnType<OverrideCallback>,
    override?: OverrideCallback,
  ): OverrideCallback =>
  (def, ...rest) => {
    const own = override ? override(def, ...rest) : ignoreOverride;
    if (own !== ignoreOverride) {
      return own;
    }
    return (def as ZodEffectsDef).effect?.type === "transform"
      ? {}
      : ignoreOverride;
  };

export default async function getToJsonSchemaFn(): Promise<ToJsonSchemaFn> {
  // Both converters are imported up front, so that `toJsonSchema.sync` can use
  // the handler once it's loaded. A missing one only fails for the schemas
  // that need it.
  const [zod4, zodToJsonSchema] = await Promise.all([
    importIfInstalled(() => import("zod/v4/core")),
    importIfInstalled(() => import("zod-to-json-schema")),
  ]);

  return (schema, options) => {
    // https://zod.dev/library-authors?id=how-to-support-zod-and-zod-mini-simultaneously#how-to-support-zod-3-and-zod-4-simultaneously
    if ("_zod" in (schema as $ZodType | ZodTypeAny)) {
      if (!zod4) {
        throw new MissingDependencyError("zod v4");
      }
      return zod4.toJSONSchema(schema as $ZodType, options) as JSONSchema7;
    }

    if (!zodToJsonSchema) {
      throw new MissingDependencyError("zod-to-json-schema");
    }
    // `zod` 4 takes `io` itself; `zod-to-json-schema` picks a pipe's side,
    // and an `effectStrategy` passed in the options decides on transforms.
    const io = ioOf(options);
    return zodToJsonSchema.zodToJsonSchema(schema as ZodTypeAny, {
      ...(io ? { pipeStrategy: io } : {}),
      ...options,
      ...(io === "output" && !options?.effectStrategy
        ? {
            override: allowAnyTransformOutput(
              zodToJsonSchema.ignoreOverride,
              options?.override as OverrideCallback | undefined,
            ),
          }
        : {}),
    }) as JSONSchema7;
  };
}
