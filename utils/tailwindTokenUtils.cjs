// --- Shared helpers ---------------------------------------------------------

// Figma mode name -> theme key / CSS class ('Brand A' -> 'brand-a').
const themeKey = (mode) => mode.toLowerCase().replace(/[^a-z0-9]+/g, '-');

// Flatten { name: { $value } } token groups to name -> value, dropping $type.
const tokenValues = (tokens) =>
  Object.fromEntries(
    Object.entries(tokens)
      .filter(([name]) => name !== '$type')
      .map(([name, token]) => [name, token.$value]),
  );

// Resolve "{A.B.C}" token references recursively to their final value.
const resolveTokenReference = (figmaTokens, value) => {
  const reference = value.match(/^\{(.+)\}$/);
  if (!reference) return value;

  const target = reference[1].split('.').reduce((current, key) => {
    if (!current || typeof current !== 'object' || !(key in current)) {
      throw new Error(`Unknown Figma token reference: ${value}`);
    }
    return current[key];
  }, figmaTokens);

  if (!target || typeof target !== 'object' || typeof target.$value !== 'string') {
    throw new Error(`Invalid Figma token reference: ${value}`);
  }

  return resolveTokenReference(figmaTokens, target.$value);
};

// --- Colors -----------------------------------------------------------------

// Turn { primary-100: v } into { 100: v }.
const colorScale = (tokens, prefix) =>
  Object.fromEntries(
    Object.entries(tokenValues(tokens)).map(([name, value]) => [
      name.replace(`${prefix}-`, ''),
      value,
    ]),
  );

// Resolve every Color-Palette reference to its hex value.
const colorPalette = (figmaTokens, tokens) =>
  Object.fromEntries(
    Object.entries(tokenValues(tokens)).map(([name, value]) => [
      name,
      resolveTokenReference(figmaTokens, value),
    ]),
  );

// Semantic color tree for one theme mode; drives the light-*/dark-* classes.
const themeColors = (figmaTokens, mode) => {
  const variables = figmaTokens.Variables[mode];
  const primitives = figmaTokens.Primitives[mode];

  return {
    background: {
      canvas: variables.Misc['body-bg'].$value,
      surface: variables.Misc.paper.$value,
    },
    misc: {
      'bg-white': variables.Misc['bg-white'].$value,
    },
    text: {
      primary: variables.Theme['text-primary'].$value,
      secondary: variables.Theme['text-secondary'].$value,
      disabled: variables.Theme['text-disabled'].$value,
    },
    border: {
      subtle: variables.Theme['outline-border'].$value,
      input: variables.Theme['input-border'].$value,
    },
    primary: colorScale(primitives.Color.Primary, 'primary'),
    secondary: colorScale(primitives.Color.Secondary, 'secondary'),
    info: colorScale(primitives.Color.Info, 'info'),
    gray: colorScale(primitives.Color.Gray, 'gray'),
    error: colorScale(primitives.Color.Error, 'error'),
    success: colorScale(primitives.Color.Success, 'success'),
    warning: colorScale(primitives.Color.Warning, 'warning'),
    palette: colorPalette(figmaTokens, variables['Color-Palette']),
    action: {
      active: variables.Theme['action-active'].$value,
      hover: variables.Theme['action-hover'].$value,
      selected: variables.Theme['action-selected'].$value,
      disabled: variables.Theme['action-disabled-bg'].$value,
    },
  };
};

// Flatten the color tree into CSS vars for one mode (--palette-primary-main, ...).
const colorVariablesForMode = (figmaTokens, mode) => {
  const flatten = (obj, path, out) => {
    for (const [key, value] of Object.entries(obj)) {
      const next = [...path, key];
      if (typeof value === 'string') out[`--${next.join('-')}`] = value;
      else flatten(value, next, out);
    }
    return out;
  };
  return flatten(themeColors(figmaTokens, mode), [], {});
};

// Same tree with var(--...) values so unprefixed classes follow the active theme.
const adaptiveColors = (figmaTokens) => {
  const modes = Object.keys(figmaTokens.Variables);
  const defaultMode = modes.includes('Light') ? 'Light' : modes[0];
  const build = (obj, path) =>
    Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        typeof value === 'string'
          ? `var(--${[...path, key].join('-')})`
          : build(value, [...path, key]),
      ]),
    );
  return build(themeColors(figmaTokens, defaultMode), []);
};

// --- Dimensions (spacing, radius) -------------------------------------------

// Strip the group prefix from dimension token names.
const dimensionScale = (tokens) =>
  Object.fromEntries(
    Object.entries(tokenValues(tokens)).map(([name, value]) => [
      name.replace(/^[a-z-]+/, ''),
      value,
    ]),
  );

// Spacing/radius utilities as var(--...) references (union across modes).
const dimensions = (figmaTokens, primitiveName, variablePrefix) => {
  const names = [
    ...new Set(
      Object.values(figmaTokens.Primitives).flatMap((primitives) =>
        Object.keys(dimensionScale(primitives[primitiveName])),
      ),
    ),
  ];

  return Object.fromEntries(
    names.map((name) => [name, `var(--${variablePrefix}-${name})`]),
  );
};

// --spacing-*/--radius-* vars for one mode.
const dimensionVariablesForMode = (figmaTokens, mode) => {
  const primitives = figmaTokens.Primitives[mode];
  const spacing = dimensionScale(primitives.Gap);
  const borderRadius = dimensionScale(primitives['Border-Radius']);

  return {
    ...Object.fromEntries(
      Object.entries(spacing).map(([name, value]) => [`--spacing-${name}`, value]),
    ),
    ...Object.fromEntries(
      Object.entries(borderRadius).map(([name, value]) => [`--radius-${name}`, value]),
    ),
  };
};

// --- Typography (size, weight, line-height) ---------------------------------

// --<prefix>-<name> vars from a typography scale.
const scaleVariables = (tokens, prefix) =>
  Object.fromEntries(
    Object.entries(tokenValues(tokens)).map(([name, value]) => [
      `--${prefix}-${name}`,
      value,
    ]),
  );

// Font family + size/weight/line-height vars for one mode.
const typographyVariablesForMode = (figmaTokens, mode) => {
  const typography = figmaTokens.Primitives[mode].Typography;

  return {
    '--font-family': typography['font-family'].$value,
    ...scaleVariables(typography['font-size'], 'font-size'),
    ...scaleVariables(typography['font-weight'], 'font-weight'),
    ...scaleVariables(typography['line-height'], 'line-height'),
  };
};

// fontSize/fontWeight/lineHeight utilities as var(--...) references (union across modes).
const scaleUtilities = (figmaTokens, scaleName) => {
  const names = [
    ...new Set(
      Object.values(figmaTokens.Primitives).flatMap((primitives) =>
        Object.keys(tokenValues(primitives.Typography[scaleName])),
      ),
    ),
  ];

  return Object.fromEntries(
    names.map((name) => [name, `var(--${scaleName}-${name})`]),
  );
};

// --- Composition --------------------------------------------------------------

// All CSS vars for one mode; the tailwind plugin writes them under .light/.dark.
const variablesForMode = (figmaTokens, mode) => ({
  ...typographyVariablesForMode(figmaTokens, mode),
  ...dimensionVariablesForMode(figmaTokens, mode),
  ...colorVariablesForMode(figmaTokens, mode),
});

module.exports = {
  adaptiveColors,
  colorScale,
  dimensions,
  scaleUtilities,
  themeColors,
  themeKey,
  variablesForMode,
};
