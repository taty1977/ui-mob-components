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
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './.storybook/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        light: themeColors(figmaTokens, 'Light'),
        dark: themeColors(figmaTokens, 'Dark'),
        // Theme-adaptive classes (no light/dark prefix) resolve via CSS
        // variables that flip with the .light/.dark theme class.
        ...adaptiveColors(figmaTokens),
      },
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