const path = require('node:path');

const { loadFigmaTokens } = require('./utils/loadFigmaTokens.cjs');
const {
  adaptiveColors,
  dimensions,
  scaleUtilities,
  themeColors,
  themeKey,
  variablesForMode,
} = require('./utils/tailwindTokenUtils.cjs');

let figmaTokens;
try {
  figmaTokens = loadFigmaTokens(path.join(__dirname, 'tokens/figma'));
} catch {
  figmaTokens = require('./lib/commonjs/themes/generatedTokens.js').default;
}

const themeModes = Object.keys(figmaTokens.Variables);
const defaultMode = themeModes.includes('Light') ? 'Light' : themeModes[0];
const darkMode = themeModes.includes('Dark') ? 'Dark' : undefined;

const perMode = (fn) =>
  Object.fromEntries(themeModes.map((mode) => [themeKey(mode), fn(figmaTokens, mode)]));

const variablesByMode = perMode(variablesForMode);

const themeVariablesPlugin = ({ addBase }) => {
  const noThemeClass = themeModes.map((mode) => `:not(.${themeKey(mode)})`).join('');
  addBase({
    ':root': variablesByMode[themeKey(defaultMode)],
    ...(darkMode
      ? {
          '@media (prefers-color-scheme: dark)': {
            [`:root${noThemeClass}`]: variablesByMode[themeKey(darkMode)],
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
  darkMode: 'class',
  safelist: themeModes.map((mode) => themeKey(mode)),
  presets: [require('nativewind/preset')],
  content: ['./node_modules/ui-mob-components/lib/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ...perMode(themeColors),
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
