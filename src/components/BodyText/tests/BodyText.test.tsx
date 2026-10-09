import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';

import { BodyText } from '../BodyText';
import type { BodyTextProps, BodyTextVariant } from '../BodyText';

type AnyElement = ReactElement & { props: Record<string, unknown> };

const renderText = (props: Partial<BodyTextProps> = {}) =>
  BodyText({ children: 'Vitals look stable.', ...props }) as unknown as AnyElement;

const classOf = (el: AnyElement) => el.props.className as string;

describe('BodyText', () => {
  // --- Variants ------------------------------------------------------------------

  it('maps each variant to its token font size', () => {
    const sizes: Record<BodyTextVariant, string> = {
      subtitle1: 'text-18',
      subtitle2: 'text-15',
      body1: 'text-15',
      body2: 'text-13',
      caption: 'text-12',
      overline: 'text-12',
    };
    for (const [variant, size] of Object.entries(sizes)) {
      expect(classOf(renderText({ variant: variant as BodyTextVariant }))).toContain(size);
    }
  });

  it('applies the per-variant default weight and uppercase overline', () => {
    expect(classOf(renderText({ variant: 'subtitle1' }))).toContain('font-medium');
    expect(classOf(renderText({ variant: 'body1' }))).toContain('font-regular');

    const overline = classOf(renderText({ variant: 'overline' }));
    expect(overline).toContain('uppercase');
    expect(overline).toContain('tracking-wider');
  });

  it('lets the weight prop override the variant default', () => {
    const el = renderText({ variant: 'body1', weight: 'bold' });
    expect(classOf(el)).toContain('font-bold');
    expect(classOf(el)).not.toContain('font-regular');
  });

  // --- Tone & content -----------------------------------------------------------------

  it('applies the tone class and uses the theme font', () => {
    expect(classOf(renderText({ tone: 'muted' }))).toContain('text-text-secondary');
    expect(classOf(renderText({ tone: 'error' }))).toContain('text-palette-error-main');
    expect(classOf(renderText())).toContain('font-sans');
  });

  it('renders the text and merges className', () => {
    const el = renderText({ className: 'mt-2' });
    expect(el.props.children).toBe('Vitals look stable.');
    expect(classOf(el)).toContain('mt-2');
  });
});
