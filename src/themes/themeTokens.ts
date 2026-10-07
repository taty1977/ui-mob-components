import figmaTokens from '../../tokens/figma/tokens.json';

export type FigmaThemeMode = keyof typeof figmaTokens.Variables;

const pixels = (value: string) => Number.parseFloat(value);

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

const mapCoreTokens = (
    variables: (typeof figmaTokens.Variables)[FigmaThemeMode],
    primitives: (typeof figmaTokens.Primitives)[FigmaThemeMode],
) => ({
    color: {
        primary: {
            100: primitives.Color.Primary['primary-100'].$value,
            200: primitives.Color.Primary['primary-200'].$value,
            300: primitives.Color.Primary['primary-300'].$value,
            400: primitives.Color.Primary['primary-400'].$value,
            500: primitives.Color.Primary['primary-500'].$value,
            600: primitives.Color.Primary['primary-600'].$value,
            700: primitives.Color.Primary['primary-700'].$value,
            800: primitives.Color.Primary['primary-800'].$value,
            900: primitives.Color.Primary['primary-900'].$value,
        },
        secondary: {
            100: primitives.Color.Secondary['secondary-100'].$value,
            200: primitives.Color.Secondary['secondary-200'].$value,
            300: primitives.Color.Secondary['secondary-300'].$value,
            400: primitives.Color.Secondary['secondary-400'].$value,
            500: primitives.Color.Secondary['secondary-500'].$value,
            600: primitives.Color.Secondary['secondary-600'].$value,
            700: primitives.Color.Secondary['secondary-700'].$value,
            800: primitives.Color.Secondary['secondary-800'].$value,
            900: primitives.Color.Secondary['secondary-900'].$value,
        },
        info: {
            100: primitives.Color.Info['info-100'].$value,
            200: primitives.Color.Info['info-200'].$value,
            300: primitives.Color.Info['info-300'].$value,
            400: primitives.Color.Info['info-400'].$value,
            500: primitives.Color.Info['info-500'].$value,
            600: primitives.Color.Info['info-600'].$value,
            700: primitives.Color.Info['info-700'].$value,
            800: primitives.Color.Info['info-800'].$value,
            900: primitives.Color.Info['info-900'].$value,
        },
        gray: {
            100: primitives.Color.Gray['gray-100'].$value,
            200: primitives.Color.Gray['gray-200'].$value,
            300: primitives.Color.Gray['gray-300'].$value,
            400: primitives.Color.Gray['gray-400'].$value,
            500: primitives.Color.Gray['gray-500'].$value,
            600: primitives.Color.Gray['gray-600'].$value,
            700: primitives.Color.Gray['gray-700'].$value,
            800: primitives.Color.Gray['gray-800'].$value,
            900: primitives.Color.Gray['gray-900'].$value,
        },
        error: {
            100: primitives.Color.Error['error-100'].$value,
            200: primitives.Color.Error['error-200'].$value,
            300: primitives.Color.Error['error-300'].$value,
            400: primitives.Color.Error['error-400'].$value,
            500: primitives.Color.Error['error-500'].$value,
            600: primitives.Color.Error['error-600'].$value,
            700: primitives.Color.Error['error-700'].$value,
            800: primitives.Color.Error['error-800'].$value,
            900: primitives.Color.Error['error-900'].$value,
        },
        success: {
            100: primitives.Color.Success['success-100'].$value,
            200: primitives.Color.Success['success-200'].$value,
            300: primitives.Color.Success['success-300'].$value,
            400: primitives.Color.Success['success-400'].$value,
            500: primitives.Color.Success['success-500'].$value,
            600: primitives.Color.Success['success-600'].$value,
            700: primitives.Color.Success['success-700'].$value,
            800: primitives.Color.Success['success-800'].$value,
            900: primitives.Color.Success['success-900'].$value,
        },
        warning: {
            100: primitives.Color.Warning['warning-100'].$value,
            200: primitives.Color.Warning['warning-200'].$value,
            300: primitives.Color.Warning['warning-300'].$value,
            400: primitives.Color.Warning['warning-400'].$value,
            500: primitives.Color.Warning['warning-500'].$value,
            600: primitives.Color.Warning['warning-600'].$value,
            700: primitives.Color.Warning['warning-700'].$value,
            800: primitives.Color.Warning['warning-800'].$value,
            900: primitives.Color.Warning['warning-900'].$value,
        },
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

const lightModeTokens = createThemeTokens('Light');
const darkModeTokens = createThemeTokens('Dark');

export const lightTheme = { color: lightModeTokens.color } as const;
export const darkTheme = { color: darkModeTokens.color } as const;

export const themeTokens = {
    core: lightModeTokens.core,
    semantic: lightModeTokens.semantic,
    themes: {
        light: lightModeTokens,
        dark: darkModeTokens,
    },
} as const;

export type ThemeMode = keyof typeof themeTokens.themes;

export const getThemeTokens = (mode: ThemeMode) => themeTokens.themes[mode];