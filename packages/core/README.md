# Standard JSON

Standard Schema Validator's JSON Schema Converter

## Usage

```ts
import { toJsonSchema } from "@standard-community/standard-json";

// Define your schema
const schema = v.pipe(
    v.object({
        myString: v.string(),
        myUnion: v.union([v.number(), v.boolean()]),
    }),
    v.description("My neat object schema"),
);

// Convert it to JSON Schema
const jsonSchema = await toJsonSchema(schema);
```

## Compatibility

List of supported validators -

| Vendor  | Version |
| ------- | ------- |
| Zod     | 3.24.0+ |
| Valibot | 1.0+    |
| ArkType | 2.0+    |

## Credit

- This project is inspired by the work of [kwaa](https://github.com/kwaa) and their [xsschema](https://xsai.js.org/docs/packages/top-level/xsschema) package.
