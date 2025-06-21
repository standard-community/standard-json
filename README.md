# Standard JSON

[![npm version](https://img.shields.io/npm/v/@standard-community/standard-json.svg)](https://npmjs.org/package/@standard-community/standard-json "View this project on NPM")
[![npm downloads](https://img.shields.io/npm/dm/@standard-community/standard-json)](https://www.npmjs.com/package/@standard-community/standard-json)

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

// Define your validation schema
const schema = {
    // ...
};

// Convert it to JSON Schema
const jsonSchema = await toJsonSchema(schema);
```
