import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';

// Stub react-native-svg: these tests assert on structure and props,
// not on real SVG rendering (covered by Storybook).
vi.mock('react-native-svg', () => {
  const stub = (type: string) => (props: Record<string, unknown>) => ({ type, props });
  return { default: stub('Svg'), Circle: stub('Circle'), Path: stub('Path') };
});

import { SplashView } from '../Splash';
import type { SplashViewProps } from '../Splash';

type AnyElement = ReactElement & { props: Record<string, unknown> };

const renderSplash = (props: SplashViewProps = {}) => SplashView(props) as unknown as AnyElement;

describe('Splash', () => {
  // --- Rendering -----------------------------------------------------------------

  it('pulses a halo behind the logo at the requested size', () => {
    const element = renderSplash({ size: 120 });
    const [spinner] = element.props.children as AnyElement[];
    expect(spinner.props.style).toEqual({ width: 120, height: 120 });

    const [halo, logoWrap] = spinner.props.children as AnyElement[];
    const svg = halo.props.children as AnyElement;
    expect(svg.props.viewBox).toBe('0 0 100 100');
    expect(logoWrap.props.className).toContain('z-10');
  });

  it('centers the stacked logo inside the halo', () => {
    const element = renderSplash({ size: 120 });
    const [spinner] = element.props.children as AnyElement[];
    const [, logoWrap] = spinner.props.children as AnyElement[];
    const logo = logoWrap.props.children as AnyElement;
    expect(logo.props.variant).toBe('stacked');
    expect(logo.props.size).toBe(60);
  });

  it('layers the logo above the halo', () => {
    const element = renderSplash();
    const [spinner] = element.props.children as AnyElement[];
    const kids = spinner.props.children as AnyElement[];
    // Ring is absolutely positioned; the logo wrapper is z-10 and comes after it.
    expect(kids[kids.length - 1].props.className).toContain('z-10');
  });

  it('renders the message below the spinner when provided', () => {
    const element = renderSplash({ message: 'Fetching vitals…' });
    const kids = (element.props.children as AnyElement[]).filter(Boolean);
    expect(kids[kids.length - 1].props.children).toBe('Fetching vitals…');
  });

  it('hides the message when omitted', () => {
    const element = renderSplash();
    expect([element.props.children].flat().filter(Boolean)).toHaveLength(1);
  });

  // --- Accessibility ---------------------------------------------------------------

  it('exposes a progressbar role labeled by the message', () => {
    const element = renderSplash({ message: 'Fetching vitals…' });
    expect(element.props.accessibilityRole).toBe('progressbar');
    expect(element.props.accessibilityLabel).toBe('Fetching vitals…');
  });

  it('falls back to a generic Loading label without a message', () => {
    expect(renderSplash().props.accessibilityLabel).toBe('Loading');
  });
});
