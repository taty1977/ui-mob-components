const fs = require('node:fs');
const path = require('node:path');

// Merge tokens/figma/<Mode>.json files into { Variables, Primitives } keyed by mode.
const loadFigmaTokens = (dir) => {
  const tokens = { Variables: {}, Primitives: {} };

  const files = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.json'))
    .sort();

  for (const file of files) {
    const mode = path.basename(file, '.json');

    const raw = fs.readFileSync(path.join(dir, file), 'utf8').replace(/^\uFEFF/, ''); // strip BOM

    let data;
    try {
      data = JSON.parse(raw);
    } catch (error) {
      throw new Error(`${file} is not valid JSON: ${error.message}`);
    }

    if (!data?.Variables || !data?.Primitives) {
      throw new Error(`${file} must contain "Variables" and "Primitives" for mode "${mode}"`);
    }

    tokens.Variables[mode] = data.Variables;
    tokens.Primitives[mode] = data.Primitives;
  }

  return tokens;
};

module.exports = { loadFigmaTokens };
