// Consumer-facing Tailwind preset: the Figma-token theme (colors, spacing,
// radii, typography scales) plus the light/dark CSS variables that
// ui-mob-components classes resolve against. Usage in the consuming app:
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
  // Published package: only the built copy under lib/ is shipped.
  figmaTokens = require('./lib/tokens/figma/tokens.json');
}

const {
  adaptiveColors,
  dimensions,
  scaleUtilities,
  themeColors,
  variablesForMode,
} = require('./utils/tailwindTokenUtils.cjs');

const lightModeVariables = variablesForMode(figmaTokens, 'Light');
const darkModeVariables = variablesForMode(figmaTokens, 'Dark');

// Emit per-theme CSS vars: explicit .light/.dark class wins, otherwise fall
// back to the system color scheme (unless .light is forced).
const themeVariablesPlugin = ({ addBase }) => {
  addBase({
    ':root': lightModeVariables,
    '@media (prefers-color-scheme: dark)': {
      ':root:not(.light)': darkModeVariables,
    },
    '.light': lightModeVariables,
    '.dark': darkModeVariables,
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
        // Static hex per theme: bg-light-*/bg-dark-* classes.
        light: themeColors(figmaTokens, 'Light'),
        dark: themeColors(figmaTokens, 'Dark'),
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
