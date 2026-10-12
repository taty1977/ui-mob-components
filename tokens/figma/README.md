# Figma Tokens

One `<Mode>.json` per theme mode (`Light`, `Dark`, `Teal`), each holding that
mode's `Variables` and `Primitives`. Together they are the source of truth for
the design tokens.

`npm run generate-tokens` merges and bakes them into
`src/themes/generatedTokens.ts` (validated; fails on broken references). See
`../README.md` for how to add a theme.
