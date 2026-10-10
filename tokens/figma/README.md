# Figma Tokens

`tokens.json` is the single Figma export and source of truth for the design
tokens. It holds `Variables` and `Primitives`, each keyed by theme mode
(`Light`, `Dark`, ...).

`npm run generate-tokens` bakes it into `src/themes/generatedTokens.ts`
(validated; fails on broken references). See `../README.md` for how to add a
theme.
