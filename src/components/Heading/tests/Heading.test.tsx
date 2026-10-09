import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';

import { Heading } from '../Heading';
import type { HeadingProps, HeadingVariant } from '../Heading';

type AnyElement = ReactElement & { props: Record<string, unknown> };

const renderHeading = (props: Partial<HeadingProps> = {}) =>
  Heading({ children: 'Symptoms', ...props }) as unknown as AnyElement;

const classOf = (el: AnyElement) => el.props.className as string;

describe('Heading', () => {
  // --- Variants ------------------------------------------------------------------

  it('maps each level to its token font size', () => {
    const sizes: Record<HeadingVariant, string> = {
      h1: 'text-46',
      h2: 'text-38',
      h3: 'text-28',
      h4: 'text-24',
      h5: 'text-18',
      h6: 'text-15',
    };
    for (const [variant, size] of Object.entries(sizes)) {
      expect(classOf(renderHeading({ variant: variant as HeadingVariant }))).toContain(size);
    }
  });

  it('exposes the header role and the matching web heading level', () => {
    const h2 = renderHeading({ variant: 'h2' });
    expect(h2.props.accessibilityRole).toBe('header');
    expect(h2.props['aria-level']).toBe(2);
  });

  it('defaults to h4 bold in the theme font', () => {
    const el = renderHeading();
    expect(classOf(el)).toContain('text-24');
    expect(classOf(el)).toContain('font-bold');
    expect(classOf(el)).toContain('font-sans');
  });

  // --- Tone & weight -----------------------------------------------------------------

  it('applies the tone and weight classes', () => {
    expect(classOf(renderHeading({ tone: 'muted' }))).toContain('text-text-secondary');
    expect(classOf(renderHeading({ tone: 'success' }))).toContain('text-palette-success-main');
    expect(classOf(renderHeading({ weight: 'regular' }))).toContain('font-regular');
  });

  // --- Content -------------------------------------------------------------------------

  it('renders the text and merges className', () => {
    const el = renderHeading({ className: 'mt-4' });
    expect(el.props.children).toBe('Symptoms');
    expect(classOf(el)).toContain('mt-4');
  });
});
