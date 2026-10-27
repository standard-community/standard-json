# Dependency security

## Zod 3 compatibility

Zod 3 support is retained. The upstream advisory
[GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5)
currently marks Zod versions below 4.6.6 as affected by resource exhaustion
while validating large collections. The latest Zod 3 release is 3.25.76;
upstream has not published a patched Zod 3 release.

Upgrading build and test dependencies does not resolve this advisory for an
application that validates untrusted input with Zod 3. Applications should
limit request sizes before parsing and use a patched validator when compatible.
Do not treat a successful test run or a development lockfile update as evidence
that a consuming application's validator is patched.

The advisory remains visible in dependency audits. It is not suppressed, and
Zod 3 is not silently replaced with Zod 4.

## Schema conversion

This package converts schema definitions; it does not replace or patch the
application's vendor validator. Supported optional peer dependency ranges stay
compatible with existing consumers, who control their installed validator.
