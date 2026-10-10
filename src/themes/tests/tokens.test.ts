import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import figmaTokens, { themeKeys } from '../generatedTokens';
import {
    getThemeTokens,
    mapTokensToTheme,
    themeTokens,
    type FigmaThemeMode,
} from '../themeTokens';

// createRequire keeps these files out of tsc/bob's declaration build.
const nodeRequire = createRequire(import.meta.url);

const sourceTokens = JSON.parse(
    readFileSync(path.join(process.cwd(), 'tokens/figma/tokens.json'), 'utf8').replace(/^\uFEFF/, ''),
) as typeof figmaTokens;

const modes = Object.keys(sourceTokens.Variables) as FigmaThemeMode[];

describe('token pipeline', () => {
    it('ships a generated module identical to the Figma export', () => {
        expect(figmaTokens).toEqual(sourceTokens);
    });

    it('exposes resolved tokens for every theme mode', () => {
        expect(Object.keys(themeTokens.themes)).toEqual(modes.map((mode) => themeKeys[mode]));

        for (const mode of modes) {
            const tokens = getThemeTokens(themeKeys[mode]);
            expect(tokens.color.background.canvas).toEqual(expect.any(String));
            expect(tokens.core.space[4]).toEqual(expect.any(Number));
        }
    });

    it('maps every mode to a semantic theme without throwing', () => {
        for (const mode of modes) {
            const theme = mapTokensToTheme(figmaTokens, mode);
            expect(theme.semantic.color.text.primary).toEqual(expect.any(String));
        }
    });

    it('generates Tailwind color groups and CSS variables for every mode', () => {
        const preset = nodeRequire('../../../tailwind.preset.js');
        const { themeKey, variablesForMode } = nodeRequire('../../../utils/tailwindTokenUtils.cjs');

        for (const mode of modes) {
            const variables = variablesForMode(figmaTokens, mode);
            expect(Object.keys(variables).length).toBeGreaterThan(0);
            expect(preset.theme.extend.colors).toHaveProperty(themeKeys[mode]);
            expect(themeKeys[mode]).toBe(themeKey(mode));
        }
    });
});
