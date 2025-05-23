# Standard JSON

[![npm version](https://img.shields.io/npm/v/@standard-community/standard-json.svg)](https://npmjs.org/package/@standard-community/standard-json "View this project on NPM")
[![npm downloads](https://img.shields.io/npm/dm/@standard-community/standard-json)](https://www.npmjs.com/package/@standard-community/standard-json)
[![license](https://img.shields.io/npm/l/@standard-community/standard-json)](LICENSE)

Standard Schema Validator's JSON Schema Converter

## Installation

Install the main package -

```sh
pnpm add @standard-community/standard-json
```

For some specific vendor, install the respective package also -

| Vendor  | Package |
| ------- | ------- |
| Zod     | `zod-to-json-schema` |
| Valibot | `@valibot/to-json-schema` |

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

| Vendor  | Supported |
| ------- | ------- |
| Zod     | ✅ |
| Valibot | ✅ |
| ArkType | ✅ |
| Typebox | ✅ (Using [TypeMap](https://github.com/sinclairzx81/typemap) |
| Effect Schema | 🛠️ |

You can check the compatibility versions at [standardschema.dev](https://standardschema.dev/)

## Credit

- This project is inspired by the work of [kwaa](https://github.com/kwaa) and their [xsschema](https://xsai.js.org/docs/packages/top-level/xsschema) package.
