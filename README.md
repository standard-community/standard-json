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
| Zod v3  | `zod-to-json-schema` |
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

### Input or output

A schema that transforms or defaults its input accepts something different from what it outputs. Pass `io` to choose which of the two is converted:

```ts
const inputSchema = await toJsonSchema(schema, { io: "input" });
const outputSchema = await toJsonSchema(schema, { io: "output" });
```

Without `io`, each vendor converts the side it does by default. A vendor's own option for it, like `typeMode` for Valibot, still wins.

### A schema that carries its own JSON Schema

A schema from a library that is not on the built-in list converts as well when it carries [Standard JSON Schema](https://standardschema.dev/json-schema), the `jsonSchema` member of `~standard`: `toJsonSchema` calls its `input()`, or `output()` when `io` says so, with the `target` from the options (`draft-2020-12` when none is given). The other options, without `io` and `target`, reach it as `libraryOptions`, which is `undefined` when there are none. A built-in vendor or a handler registered with `loadVendor` still takes precedence.

### Sync Usage

This is useful for -

#### Adding support for Unsupported validation libs

```ts
import { toJsonSchema, loadVendor } from "@standard-community/standard-json";
import { convertSchemaToJson } from "your-validation-lib";

// The lib should support Standard Schema, like Sury
// as we use 'schema["~standard"].vendor' to get the vendor name
// Eg. loadVendor(zod["~standard"].vendor, convertorFunction)
loadVendor("validation-lib-name", convertSchemaToJson)

// Define your validation schema
const schema = {
    // ...
};

// Convert it to JSON Schema
const jsonSchema = toJsonSchema(schema);
```

#### Customize the toJSONFunction of a supported lib

```ts
import { toJsonSchema, loadVendor } from "@standard-community/standard-json";
import zodHandler from "@standard-community/standard-json/zod";

// Or pass a custom implmentation
loadVendor("zod", zodHandler())

// Define your validation schema
const schema = {
    // ...
};

// Convert it to JSON Schema
const jsonSchema = await toJsonSchema(schema);
```
