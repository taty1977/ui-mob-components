// Generates src/themes/generatedTokens.ts from the Figma export so the
// published package embeds tokens as plain JS.
// Usage: node scripts/generate-tokens.js [--check]  (--check fails if stale, for CI)
const fs = require('node:fs');
const path = require('node:path');

const { themeKey } = require('../utils/tailwindTokenUtils.cjs');

const source = path.resolve(__dirname, '../tokens/figma/tokens.json');
const destination = path.resolve(__dirname, '../src/themes/generatedTokens.ts');

// --- Validation ---------------------------------------------------------------

// Token groups every mode must provide.
const REQUIRED_VARIABLE_GROUPS = ['Theme', 'Misc', 'Color-Palette'];
const REQUIRED_PRIMITIVE_GROUPS = ['Color', 'Gap', 'Border-Radius', 'Typography'];

// Fail the build on unresolvable "{A.B.C}" references.
const collectReferenceErrors = (tokens, errors) => {
  const visit = (node, trail) => {
    if (!node || typeof node !== 'object') return;

    for (const [key, value] of Object.entries(node)) {
      const at = [...trail, key].join('.');

      if (typeof value !== 'string') {
        visit(value, [...trail, key]);
        continue;
      }

      const reference = value.match(/^\{(.+)\}$/);
      if (!reference) continue;

      let target = tokens;
      for (const segment of reference[1].split('.')) {
        if (!target || typeof target !== 'object' || !(segment in target)) {
          errors.push(`${at}: unknown reference {${reference[1]}}`);
          break;
        }
        target = target[segment];
      }
    }
  };

  visit(tokens, []);
};

const validate = (tokens) => {
  const errors = [];

  for (const root of ['Variables', 'Primitives']) {
    if (!tokens[root] || typeof tokens[root] !== 'object') {
      errors.push(`missing top-level "${root}" object`);
    }
  }
  if (errors.length > 0) return errors;

  const variableModes = Object.keys(tokens.Variables);
  const primitiveModes = Object.keys(tokens.Primitives);

  for (const mode of variableModes) {
    if (!primitiveModes.includes(mode)) {
      errors.push(`mode "${mode}" exists in Variables but not in Primitives`);
      continue;
    }
    for (const group of REQUIRED_VARIABLE_GROUPS) {
      if (!tokens.Variables[mode][group]) {
        errors.push(`Variables.${mode}: missing "${group}" group`);
      }
    }
    for (const group of REQUIRED_PRIMITIVE_GROUPS) {
      if (!tokens.Primitives[mode][group]) {
        errors.push(`Primitives.${mode}: missing "${group}" group`);
      }
    }
  }
  for (const mode of primitiveModes) {
    if (!tokens.Variables[mode]) {
      errors.push(`mode "${mode}" exists in Primitives but not in Variables`);
    }
  }

  collectReferenceErrors(tokens, errors);
  return errors;
};

// --- Generation -----------------------------------------------------------------

// Strip the BOM — JSON.parse rejects it.
const raw = fs.readFileSync(source, 'utf8').replace(/^\uFEFF/, '');

let tokens;
try {
  tokens = JSON.parse(raw);
} catch (error) {
  console.error(`tokens/figma/tokens.json is not valid JSON: ${error.message}`);
  process.exit(1);
}

const errors = validate(tokens);
if (errors.length > 0) {
  console.error('Invalid tokens/figma/tokens.json:');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

// JSON is a valid JS literal; pretty-print for reviewable diffs. themeKeys is
// baked in so src/ code never re-implements the mode -> theme-key mapping.
const themeKeys = Object.fromEntries(
  Object.keys(tokens.Variables).map((mode) => [mode, themeKey(mode)]),
);

const output = `// AUTO-GENERATED from tokens/figma/tokens.json — do not edit; run "npm run generate-tokens".
const figmaTokens = ${JSON.stringify(tokens, null, 2)};

export const themeKeys = ${JSON.stringify(themeKeys)} as const;

export default figmaTokens;
`;

if (process.argv.includes('--check')) {
  const current = fs.existsSync(destination) ? fs.readFileSync(destination, 'utf8') : '';
  if (current !== output) {
    console.error(
      'src/themes/generatedTokens.ts is stale — run "npm run generate-tokens" and commit the result.',
    );
    process.exit(1);
  }
  console.log('src/themes/generatedTokens.ts is up to date.');
} else {
  fs.writeFileSync(destination, output);
  console.log(`Generated ${path.relative(process.cwd(), destination)}`);
}
