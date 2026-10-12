const themeKey = (mode) => mode.toLowerCase().replace(/[^a-z0-9]+/g, '-');

const tokenValues = (tokens) =>
  Object.fromEntries(
    Object.entries(tokens)
      .filter(([name]) => name !== '$type')
      .map(([name, token]) => [name, token.$value]),
  );

// Resolve "{A.B.C}" token references to their final value.
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

const toVars = (map, prefix) =>
  Object.fromEntries(Object.entries(map).map(([name, value]) => [`--${prefix}-${name}`, value]));

// Union of token names across modes -> var(--<prefix>-<name>) references.
const unionVarRefs = (figmaTokens, pick, prefix) => {
  const names = [
    ...new Set(
      Object.values(figmaTokens.Primitives).flatMap((primitives) => Object.keys(pick(primitives))),
    ),
  ];
  return Object.fromEntries(names.map((name) => [name, `var(--${prefix}-${name})`]));
};

// { primary-100: v } -> { 100: v }
const colorScale = (tokens, prefix) =>
  Object.fromEntries(
    Object.entries(tokenValues(tokens)).map(([name, value]) => [
      name.replace(`${prefix}-`, ''),
      value,
    ]),
  );

const colorPalette = (figmaTokens, tokens) =>
  Object.fromEntries(
    Object.entries(tokenValues(tokens)).map(([name, value]) => [
      name,
      resolveTokenReference(figmaTokens, value),
    ]),
  );

// Single color tree per mode — drives CSS vars, <theme>-* classes and adaptive var-based classes.
const themeColors = (figmaTokens, mode) => {
  const variables = figmaTokens.Variables[mode];
  const primitives = figmaTokens.Primitives[mode];
  const theme = tokenValues(variables.Theme);
  const misc = tokenValues(variables.Misc);

  return {
    background: {
      canvas: misc['body-bg'],
      surface: misc.paper,
    },
    misc: {
      'bg-white': misc['bg-white'],
      'bg-black': misc['bg-black'],
      'grey-light': misc['grey-light'],
      'chat-bg': misc['chat-bg'],
      'track-bg': misc['track-bg'],
      'table-header': misc['table-header'],
      'avatar-bg': misc['avatar-bg'],
      snackbar: misc.snackbar,
      'bg-facebook': misc['bg-facebook'],
      'bg-twitter': misc['bg-twitter'],
      'bg-linkedin': misc['bg-linkedin'],
    },
    text: {
      primary: theme['text-primary'],
      secondary: theme['text-secondary'],
      muted: theme['text-subtitle'],
      disabled: theme['text-disabled'],
    },
    border: {
      subtle: theme['outline-border'],
      input: theme['input-border'],
    },
    divider: theme.divider,
    'chip-background': theme['chip-background'],
    'filled-input-bg': theme['filled-input-bg'],
    'backdrop-overlay': theme['backdrop-overlay'],
    primary: colorScale(primitives.Color.Primary, 'primary'),
    secondary: colorScale(primitives.Color.Secondary, 'secondary'),
    info: colorScale(primitives.Color.Info, 'info'),
    gray: colorScale(primitives.Color.Gray, 'gray'),
    error: colorScale(primitives.Color.Error, 'error'),
    success: colorScale(primitives.Color.Success, 'success'),
    warning: colorScale(primitives.Color.Warning, 'warning'),
    palette: colorPalette(figmaTokens, variables['Color-Palette']),
    action: {
      active: theme['action-active'],
      hover: theme['action-hover'],
      selected: theme['action-selected'],
      focus: theme['action-focus'],
      disabled: theme['action-disabled-bg'],
      'disabled-content': theme['action-disabled'],
    },
  };
};

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

// Same tree with var(--...) values, so unprefixed classes follow the active theme.
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

// 'gap-1' -> '1'
const dimensionScale = (tokens) =>
  Object.fromEntries(
    Object.entries(tokenValues(tokens)).map(([name, value]) => [
      name.replace(/^[a-z-]+/, ''),
      value,
    ]),
  );

const dimensions = (figmaTokens, primitiveName, variablePrefix) =>
  unionVarRefs(
    figmaTokens,
    (primitives) => dimensionScale(primitives[primitiveName]),
    variablePrefix,
  );

const dimensionVariablesForMode = (figmaTokens, mode) => ({
  ...toVars(dimensionScale(figmaTokens.Primitives[mode].Gap), 'spacing'),
  ...toVars(dimensionScale(figmaTokens.Primitives[mode]['Border-Radius']), 'radius'),
});

const typographyVariablesForMode = (figmaTokens, mode) => {
  const typography = figmaTokens.Primitives[mode].Typography;

  return {
    '--font-family': typography['font-family'].$value,
    ...toVars(tokenValues(typography['font-size']), 'font-size'),
    ...toVars(tokenValues(typography['font-weight']), 'font-weight'),
    ...toVars(tokenValues(typography['line-height']), 'line-height'),
  };
};

const scaleUtilities = (figmaTokens, scaleName) =>
  unionVarRefs(
    figmaTokens,
    (primitives) => tokenValues(primitives.Typography[scaleName]),
    scaleName,
  );


// All CSS vars for one mode; the preset writes them under .<theme> blocks.
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
