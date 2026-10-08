/** @type {import('tailwindcss').Config} */
const figmaTokens = require('./tokens/figma/tokens.json');
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

module.exports = {
  // Dark mode is toggled by the .dark class (Storybook Theme toolbar), not media query.
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './.storybook/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
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