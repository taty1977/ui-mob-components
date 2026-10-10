// Consumer-facing Tailwind preset: Figma-token theme (colors, spacing, radii,
// typography) plus per-theme CSS variables. Every Figma mode becomes a
// .<theme> class and a bg-<theme>-*/text-<theme>-* utility group.
// Usage in the consuming app:
//
//   // tailwind.config.js
//   module.exports = {
//     presets: [require('ui-mob-components/tailwind.preset')],
//     content: ['./src/**/*.{js,jsx,ts,tsx}'],
//   };
//
// The preset already bundles the NativeWind preset and a content glob for the
// library's built output; the app only needs to add its own source globs.

let figmaTokens;
try {
  // Repo development: prefer the source tokens (fresh, no build needed).
  figmaTokens = require('./tokens/figma/tokens.json');
} catch {
  // Published package: tokens are baked into the compiled library output,
  // so no separate tokens file needs to be resolved or installed.
  figmaTokens = require('./lib/commonjs/themes/generatedTokens.js').default;
}

const {
  adaptiveColors,
  dimensions,
  scaleUtilities,
  themeColors,
  themeKey,
  variablesForMode,
} = require('./utils/tailwindTokenUtils.cjs');

// Modes come from the Figma export; new ones are wired up automatically.
const themeModes = Object.keys(figmaTokens.Variables);
const defaultMode = themeModes.includes('Light') ? 'Light' : themeModes[0];
const darkMode = themeModes.includes('Dark') ? 'Dark' : undefined;

const perMode = (fn) =>
  Object.fromEntries(themeModes.map((mode) => [themeKey(mode), fn(figmaTokens, mode)]));

const variablesByMode = perMode(variablesForMode);

// .<theme> class wins; system dark mode applies unless the default is forced.
const themeVariablesPlugin = ({ addBase }) => {
  addBase({
    ':root': variablesByMode[themeKey(defaultMode)],
    ...(darkMode
      ? {
          '@media (prefers-color-scheme: dark)': {
            [`:root:not(.${themeKey(defaultMode)})`]: variablesByMode[themeKey(darkMode)],
          },
        }
      : {}),
    ...Object.fromEntries(
      Object.entries(variablesByMode).map(([key, variables]) => [`.${key}`, variables]),
    ),
  });
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  // Dark mode is toggled by the .dark class, not media query.
  darkMode: 'class',
  presets: [require('nativewind/preset')],
  // Resolved from the consumer's cwd; harmless when the path does not exist
  // (e.g. hoisted monorepo installs can add their own glob).
  content: ['./node_modules/ui-mob-components/lib/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Static hex per theme: bg-<theme>-* classes.
        ...perMode(themeColors),
        // Unprefixed classes (text-palette-primary-main) follow the active theme.
        ...adaptiveColors(figmaTokens),
      },
      // Token-driven scales; values are var(--...) references to the theme vars.
      spacing: dimensions(figmaTokens, 'Gap', 'spacing'),
      borderRadius: dimensions(figmaTokens, 'Border-Radius', 'radius'),
      fontFamily: {
        sans: ['var(--font-family)'],
      },
      fontSize: scaleUtilities(figmaTokens, 'font-size'),
      fontWeight: scaleUtilities(figmaTokens, 'font-weight'),
      lineHeight: scaleUtilities(figmaTokens, 'line-height'),
    },
  },
  plugins: [themeVariablesPlugin],
};
