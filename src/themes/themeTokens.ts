import figmaTokens, { themeKeys } from './generatedTokens';

export type FigmaThemeMode = keyof typeof figmaTokens.Variables;

// --- Helpers ------------------------------------------------------------------

const pixels = (value: string) => Number.parseFloat(value);

// Resolve "{A.B.C}" token references recursively to their final value.
const resolveTokenValue = (value: string): string => {
    const reference = value.match(/^\{(.+)\}$/);
    if (!reference) return value;

    const token = reference[1].split('.').reduce<unknown>((current, key) => {
        if (typeof current !== 'object' || current === null || !(key in current)) {
            throw new Error(`Unknown Figma token reference: ${value}`);
        }
        return (current as Record<string, unknown>)[key];
    }, figmaTokens);

    if (typeof token !== 'object' || token === null || !('$value' in token)) {
        throw new Error(`Invalid Figma token reference: ${value}`);
    }

    return resolveTokenValue((token as { $value: string }).$value);
};

const SCALE_STEPS = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;

// Build a 100–900 scale from a primitives color group (Color.Primary, ...).
const colorScale = (colors: Record<string, { $value: string }>, prefix: string) =>
    Object.fromEntries(
        SCALE_STEPS.map((step) => [step, colors[`${prefix}-${step}`].$value]),
    );

// Resolve every Color-Palette token reference to its hex value.
const mapColorPalette = (
    palette: (typeof figmaTokens.Variables)[FigmaThemeMode]['Color-Palette'],
) =>
    Object.fromEntries(
        Object.entries(palette)
            .flatMap(([name, token]) => {
                if (
                    name === '$type' ||
                    typeof token !== 'object' ||
                    !('$value' in token) ||
                    typeof token.$value !== 'string'
                ) {
                    return [];
                }
                return [[name, resolveTokenValue(token.$value)]];
            }),
    );

// --- Theme assembly -------------------------------------------------------------

// Primitives -> core token scales (shared structure across modes).
const mapCoreTokens = (
    variables: (typeof figmaTokens.Variables)[FigmaThemeMode],
    primitives: (typeof figmaTokens.Primitives)[FigmaThemeMode],
) => ({
    color: {
        primary: colorScale(primitives.Color.Primary, 'primary'),
        secondary: colorScale(primitives.Color.Secondary, 'secondary'),
        info: colorScale(primitives.Color.Info, 'info'),
        gray: colorScale(primitives.Color.Gray, 'gray'),
        error: colorScale(primitives.Color.Error, 'error'),
        success: colorScale(primitives.Color.Success, 'success'),
        warning: colorScale(primitives.Color.Warning, 'warning'),
        palette: mapColorPalette(variables['Color-Palette']),
    },
    space: {
        1: pixels(primitives.Gap['gap-1'].$value),
        2: pixels(primitives.Gap['gap-2'].$value),
        3: pixels(primitives.Gap['gap-3'].$value),
        4: pixels(primitives.Gap['gap-4'].$value),
        5: pixels(primitives.Gap['gap-5'].$value),
        6: pixels(primitives.Gap['gap-6'].$value),
        8: pixels(primitives.Gap['gap-8'].$value),
        10: pixels(primitives.Gap['gap-10'].$value),
        12: pixels(primitives.Gap['gap-12'].$value),
        16: pixels(primitives.Gap['gap-16'].$value),
        20: pixels(primitives.Gap['gap-16'].$value) + pixels(primitives.Gap['gap-4'].$value),
        24: pixels(primitives.Gap['gap-16'].$value) + pixels(primitives.Gap['gap-8'].$value),
    },
    radius: {
        xs: pixels(primitives['Border-Radius']['border-radius-xs'].$value),
        sm: pixels(primitives['Border-Radius']['border-radius-sm'].$value),
        md: pixels(primitives['Border-Radius']['border-radius-md'].$value),
        lg: pixels(primitives['Border-Radius']['border-radius-lg'].$value),
        xl: pixels(primitives['Border-Radius']['border-radius-xl'].$value),
        full: pixels(primitives['Border-Radius']['border-round'].$value),
    },
    fontSize: {
        xs: pixels(primitives.Typography['font-size']['12'].$value),
        sm: pixels(primitives.Typography['font-size']['13'].$value),
        md: pixels(primitives.Typography['font-size']['15'].$value),
        lg: pixels(primitives.Typography['font-size']['18'].$value),
        xl: pixels(primitives.Typography['font-size']['24'].$value),
        '2xl': pixels(primitives.Typography['font-size']['28'].$value),
        '3xl': pixels(primitives.Typography['font-size']['38'].$value),
        '4xl': pixels(primitives.Typography['font-size']['46'].$value),
    },
    fontFamily: primitives.Typography['font-family'].$value,
    fontWeight: {
        regular: Number(primitives.Typography['font-weight'].regular.$value),
        medium: Number(primitives.Typography['font-weight'].medium.$value),
        semibold: Number(primitives.Typography['font-weight'].semibold.$value),
        bold: Number(primitives.Typography['font-weight'].bold.$value),
    },
    lineHeight: {
        xs: pixels(primitives.Typography['line-height']['14'].$value),
        sm: pixels(primitives.Typography['line-height']['18'].$value),
        md: pixels(primitives.Typography['line-height']['20'].$value),
        lg: pixels(primitives.Typography['line-height']['22'].$value),
        xl: pixels(primitives.Typography['line-height']['28'].$value),
        '2xl': pixels(primitives.Typography['line-height']['38'].$value),
        '3xl': pixels(primitives.Typography['line-height']['42'].$value),
        '4xl': pixels(primitives.Typography['line-height']['56'].$value),
        '5xl': pixels(primitives.Typography['line-height']['68'].$value),
    },
});

// Variables -> semantic theme (background/text/border/action).
export function mapTokensToTheme(
    obj: typeof figmaTokens,
    mode: FigmaThemeMode,
) {
    const variables = obj.Variables[mode];
    const primitives = obj.Primitives[mode];
    const color = {
        background: {
            canvas: variables.Misc['body-bg'].$value,
            surface: variables.Misc.paper.$value,
        },
        text: {
            primary: variables.Theme['text-primary'].$value,
            secondary: variables.Theme['text-secondary'].$value,
        },
        border: {
            subtle: variables.Theme['outline-border'].$value,
        },
        primary: {
            main: primitives.Color.Primary['primary-500'].$value,
        },
    } as const;

    return {
        color,
        semantic: {
            color: {
                background: {
                    canvas: color.background.canvas,
                    surface: color.background.surface,
                    primary: color.primary.main,
                    success: primitives.Color.Success['success-500'].$value,
                    warning: primitives.Color.Warning['warning-500'].$value,
                    error: primitives.Color.Error['error-500'].$value,
                },
                text: {
                    primary: color.text.primary,
                    secondary: color.text.secondary,
                    muted: variables.Theme['text-subtitle'].$value,
                    onPrimary: variables.Misc['bg-white'].$value,
                    disabled: variables.Theme['text-disabled'].$value,
                },
                border: {
                    subtle: color.border.subtle,
                    strong: variables.Theme['input-border'].$value,
                    focus: primitives.Color.Primary['primary-500'].$value,
                },
                action: {
                    active: variables.Theme['action-active'].$value,
                    hover: variables.Theme['action-hover'].$value,
                    selected: variables.Theme['action-selected'].$value,
                    disabled: variables.Theme['action-disabled-bg'].$value,
                },
            },
            space: {
                xs: pixels(primitives.Gap['gap-1'].$value),
                sm: pixels(primitives.Gap['gap-2'].$value),
                md: pixels(primitives.Gap['gap-4'].$value),
                lg: pixels(primitives.Gap['gap-6'].$value),
                xl: pixels(primitives.Gap['gap-8'].$value),
            },
            radius: {
                sm: pixels(primitives['Border-Radius']['border-radius-sm'].$value),
                md: pixels(primitives['Border-Radius']['border-radius-md'].$value),
                lg: pixels(primitives['Border-Radius']['border-radius-lg'].$value),
                xl: pixels(primitives['Border-Radius']['border-radius-xl'].$value),
            },
        },
    } as const;
}

// Full token set for one mode: core scales + semantic layer.
const createThemeTokens = (mode: FigmaThemeMode) => {
    const variables = figmaTokens.Variables[mode];
    const primitives = figmaTokens.Primitives[mode];
    const mappedTheme = mapTokensToTheme(figmaTokens, mode);

    return {
        color: mappedTheme.color,
        core: mapCoreTokens(variables, primitives),
        semantic: mappedTheme.semantic,
    } as const;
};

// --- Public API -----------------------------------------------------------------

const lightModeTokens = createThemeTokens('Light');
const darkModeTokens = createThemeTokens('Dark');

/** Semantic colors for the light theme. */
export const lightTheme = { color: lightModeTokens.color } as const;
/** Semantic colors for the dark theme. */
export const darkTheme = { color: darkModeTokens.color } as const;

export type ThemeMode = (typeof themeKeys)[FigmaThemeMode];

// Resolved tokens per mode; new Figma modes appear after generate-tokens.
const themes = Object.fromEntries(
    (Object.keys(figmaTokens.Variables) as FigmaThemeMode[]).map((mode) => [
        themeKeys[mode],
        createThemeTokens(mode),
    ]),
) as Record<ThemeMode, ReturnType<typeof createThemeTokens>>;

/** All resolved tokens; `core`/`semantic` default to light. */
export const themeTokens = {
    core: lightModeTokens.core,
    semantic: lightModeTokens.semantic,
    themes,
} as const;

export const getThemeTokens = (mode: ThemeMode) => themes[mode];
