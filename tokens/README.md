# Design Tokens

This folder stores design token exports and source material for the component library.

Recommended layout:

- `tokens/figma/` for Figma token exports and related raw data
- `src/themes/` for app-level theme consumption and mapped token definitions

Keep raw token exports separate from application code so the tokens can be regenerated without touching component logic.

## Adding a new theme

Modes (themes) are data, not code. To add one:

1. Export the new mode from Figma into `tokens/figma/tokens.json`. It must appear under both `Variables` and `Primitives` with the standard groups (`Theme`/`Misc`/`Color-Palette` and `Color`/`Gap`/`Border-Radius`/`Typography`).
2. Run `npm run generate-tokens` (part of `npm run build`). The generator validates the structure and every `{...}` token reference, failing the build on a broken export.
3. The new theme is then automatically available as:
   - `themeTokens.themes.<theme>` / `getThemeTokens('<theme>')` at runtime
   - a `.<theme>` CSS class plus `bg-<theme>-*` / `text-<theme>-*` utilities via `tailwind.preset.js`

`npm run check-tokens` fails (for CI) if `src/themes/generatedTokens.ts` is stale relative to the Figma export, and lint-staged regenerates it automatically on commit.
