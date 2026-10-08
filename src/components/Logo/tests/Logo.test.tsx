import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';

// Stub react-native-svg: these tests assert on structure and props,
// not on real SVG rendering (covered by Storybook).
vi.mock('react-native-svg', () => {
  const stub = (type: string) => (props: Record<string, unknown>) => ({ type, props });
  return { default: stub('Svg'), Circle: stub('Circle'), Path: stub('Path') };
});

import { Logo } from '../Logo';
import type { LogoProps } from '../Logo';

type AnyElement = ReactElement & { props: Record<string, unknown> };

const renderLogo = (props: LogoProps = {}) => Logo(props) as unknown as AnyElement;

describe('Logo', () => {
  // --- Rendering -----------------------------------------------------------------

  it('renders the mark on a 100x100 grid at the requested size', () => {
    const element = renderLogo({ variant: 'icon', size: 64 });
    expect(element.props.width).toBe(64);
    expect(element.props.height).toBe(64);
    expect(element.props.viewBox).toBe('0 0 100 100');
  });

  it('renders only the mark in the icon variant', () => {
    const element = renderLogo({ variant: 'icon' });
    expect(element.props.viewBox).toBe('0 0 100 100');
    expect(element.props.children).toHaveLength(3);
  });

  it('renders the wordmark beside the mark in the horizontal variant', () => {
    const element = renderLogo();
    expect(element.props.className).toContain('flex-row');
    const [mark, textBlock] = element.props.children as AnyElement[];
    expect(mark.props.viewBox).toBe('0 0 100 100');

    const [wordmark, tagline] = textBlock.props.children as AnyElement[];
    expect(wordmark.props.numberOfLines).toBe(1);
    const [first, second] = wordmark.props.children as [string, AnyElement];
    expect(first).toBe('AllInOne ');
    expect(second.props.children).toBe('Health');
    expect(tagline.props.children).toBe('Integrated Care System');
  });

  it('stacks the mark above a centered wordmark in the stacked variant', () => {
    const element = renderLogo({ variant: 'stacked' });
    expect(element.props.className).toContain('items-center');
    expect(element.props.className).not.toContain('flex-row');
    const [mark, textBlock] = element.props.children as AnyElement[];
    expect(mark.props.viewBox).toBe('0 0 100 100');
    expect(textBlock.props.className).toContain('items-center');
  });

  // --- Accessibility ---------------------------------------------------------------

  it('keeps the mark decorative in the horizontal variant (the wordmark announces)', () => {
    const element = renderLogo({ accessibilityLabel: 'AllInOne Health' });
    const [mark] = element.props.children as AnyElement[];
    expect(mark.props.accessibilityRole).toBe('none');
  });

  it('is decorative unless the standalone mark is labeled', () => {
    const plain = renderLogo({ variant: 'icon' });
    expect(plain.props.accessibilityRole).toBe('none');
    expect(plain.props.accessible).toBe(false);

    const labeled = renderLogo({ variant: 'icon', accessibilityLabel: 'AllInOne Health' });
    expect(labeled.props.accessibilityRole).toBe('image');
    expect(labeled.props.accessible).toBe(true);
    expect(labeled.props.accessibilityLabel).toBe('AllInOne Health');
  });
});
