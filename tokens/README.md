# Design Tokens

This folder stores design token exports and source material for the component library.

Recommended layout:

- `tokens/figma/` for Figma token exports and related raw data
- `src/themes/` for app-level theme consumption and mapped token definitions

Keep raw token exports separate from application code so the tokens can be regenerated without touching component logic.
