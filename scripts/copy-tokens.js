const fs = require('node:fs');
const path = require('node:path');

const source = path.resolve(__dirname, '../tokens/figma/tokens.json');
const destination = path.resolve(__dirname, '../lib/tokens/figma/tokens.json');

fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.copyFileSync(source, destination);