import type { JSONSchema7 } from "json-schema";
import type { ZodEffectsDef, ZodTypeAny } from "zod/v3";
import type { $ZodType } from "zod/v4/core";
import type { OverrideCallback } from "zod-to-json-schema";
import { ioOf, MissingDependencyError, type ToJsonSchemaFn } from "./utils.js";

type ZodToJsonSchema = Pick<
  typeof import("zod-to-json-schema"),
  "ignoreOverride" | "parseDef"
>;

const importIfInstalled = async <T>(load: () => Promise<T>) => {
  try {
    return await load();
  } catch {
    return undefined;
  }
};

// `zod-to-json-schema` writes a `transform` as the input it accepts, which
// needn't describe what it outputs, so the output allows any value there. An
// `override` passed in the options still decides first. The transform is then
// parsed as `effectStrategy: "any"` would parse it, so that its description and
// a `postProcess` passed in the options still apply, which returning a schema
// from the `override` would skip. The `override` is left out there, as it
// already ran for this transform.
const allowAnyTransformOutput =
  (
    { ignoreOverride, parseDef }: ZodToJsonSchema,
    override?: OverrideCallback,
  ): OverrideCallback =>
  (def, refs, seen, forceResolution) => {
    const own = override
      ? override(def, refs, seen, forceResolution)
      : ignoreOverride;
    if (own !== ignoreOverride) {
      return own;
    }
    return (def as ZodEffectsDef).effect?.type === "transform"
      ? parseDef(
          def,
          { ...refs, effectStrategy: "any", override: undefined },
          forceResolution,
        )
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
    // Every vendor converts the input unless the options name an `io`.
    const io = ioOf(options);

    // https://zod.dev/library-authors?id=how-to-support-zod-and-zod-mini-simultaneously#how-to-support-zod-3-and-zod-4-simultaneously
    if ("_zod" in (schema as $ZodType | ZodTypeAny)) {
      if (!zod4) {
        throw new MissingDependencyError("zod v4");
      }
      // `zod` 4 converts the output when it's given no `io`.
      return zod4.toJSONSchema(schema as $ZodType, {
        ...options,
        io: io ?? "input",
      }) as JSONSchema7;
    }

    if (!zodToJsonSchema) {
      throw new MissingDependencyError("zod-to-json-schema");
    }
    // `zod-to-json-schema` picks a pipe's side, and both when it's given no
    // `pipeStrategy`. An `effectStrategy` passed in the options decides on
    // transforms.
    return zodToJsonSchema.zodToJsonSchema(schema as ZodTypeAny, {
      pipeStrategy: io ?? "input",
      ...options,
      ...(io === "output" && !options?.effectStrategy
        ? {
            override: allowAnyTransformOutput(
              zodToJsonSchema,
              options?.override as OverrideCallback | undefined,
            ),
          }
        : {}),
    }) as JSONSchema7;
  };
}
