const tokenValues = (tokens) =>
  Object.fromEntries(
    Object.entries(tokens)
      .filter(([name]) => name !== '$type')
      .map(([name, token]) => [name, token.$value]),
  );

const colorScale = (tokens, prefix) =>
  Object.fromEntries(
    Object.entries(tokenValues(tokens)).map(([name, value]) => [
      name.replace(`${prefix}-`, ''),
      value,
    ]),
  );

const themeColors = (figmaTokens, mode) => {
  const variables = figmaTokens.Variables[mode];
  const primitives = figmaTokens.Primitives[mode];

  return {
    background: {
      canvas: variables.Misc['body-bg'].$value,
      surface: variables.Misc.paper.$value,
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
    brand: {
      primary: primitives.Color.Primary['primary-500'].$value,
      50: '#f5f3ff',
      ...colorScale(primitives.Color.Primary, 'primary'),
    },
    neutral: {
      50: variables.Misc['grey-light'].$value,
      ...colorScale(primitives.Color.Gray, 'gray'),
    },
    error: colorScale(primitives.Color.Error, 'error'),
    success: colorScale(primitives.Color.Success, 'success'),
    warning: colorScale(primitives.Color.Warning, 'warning'),
    action: {
      active: variables.Theme['action-active'].$value,
      hover: variables.Theme['action-hover'].$value,
      selected: variables.Theme['action-selected'].$value,
      disabled: variables.Theme['action-disabled-bg'].$value,
    },
  };
};

const dimensionScale = (tokens) =>
  Object.fromEntries(
    Object.entries(tokenValues(tokens)).map(([name, value]) => [
      name.replace(/^[a-z-]+/, ''),
      value,
    ]),
  );

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

const scaleVariables = (tokens, prefix) =>
  Object.fromEntries(
    Object.entries(tokenValues(tokens)).map(([name, value]) => [
      `--${prefix}-${name}`,
      value,
    ]),
  );

const typographyVariablesForMode = (figmaTokens, mode) => {
  const typography = figmaTokens.Primitives[mode].Typography;

  return {
    '--font-family': typography['font-family'].$value,
    ...scaleVariables(typography['font-size'], 'font-size'),
    ...scaleVariables(typography['font-weight'], 'font-weight'),
    ...scaleVariables(typography['line-height'], 'line-height'),
  };
};

const variablesForMode = (figmaTokens, mode) => ({
  ...typographyVariablesForMode(figmaTokens, mode),
  ...dimensionVariablesForMode(figmaTokens, mode),
});

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

module.exports = {
  colorScale,
  dimensions,
  scaleUtilities,
  themeColors,
  variablesForMode,
};