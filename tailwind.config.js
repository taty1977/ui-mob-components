/** @type {import('tailwindcss').Config} */
// Theme, tokens and dark-mode wiring live in ./tailwind.preset.js — the same
// preset shipped to consumers — so this repo and its consumers stay in sync.
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './.storybook/**/*.{js,jsx,ts,tsx}'],
  presets: [require('./tailwind.preset')],
};