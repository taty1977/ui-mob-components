import { describe, expect, it, vi } from 'vitest';

// Stub react-native-svg: these tests assert on the props Icon passes,
// not on real SVG rendering (covered by Storybook).
vi.mock('react-native-svg', () => {
  const Svg = (props: Record<string, unknown>) => ({ type: 'Svg', props });
  const Path = (props: Record<string, unknown>) => ({ type: 'Path', props });
  return { default: Svg, Path };
});

import { Icon } from '../Icon';
import type { IconProps } from '../Icon';
import { iconPaths, type IconName } from '../paths';

const renderIcon = (props: IconProps) => Icon(props);

describe('Icon', () => {
  // --- Rendering -----------------------------------------------------------------

  it('renders an SVG for every registered icon name', () => {
    for (const name of Object.keys(iconPaths) as IconName[]) {
      expect(renderIcon({ name }).props.viewBox).toBe('0 0 24 24');
    }
  });

  it('maps size tokens to pixel dimensions', () => {
    const sizes = { sm: 16, md: 20, lg: 24, xl: 32, xxl: 40 };
    for (const size of Object.keys(sizes) as (keyof typeof sizes)[]) {
      expect(renderIcon({ name: 'plus', size }).props.width).toBe(sizes[size]);
    }
  });

  it('uses currentColor fill so icons inherit the surrounding text color', () => {
    expect(renderIcon({ name: 'plus' }).props.fill).toBe('currentColor');
  });

  // --- Styling -------------------------------------------------------------------

  it('applies a tone class unless tone is inherit', () => {
    expect(renderIcon({ name: 'plus', tone: 'primary' }).props.className).toContain(
      'text-palette-primary-main'
    );
    expect(renderIcon({ name: 'plus', tone: 'inherit' }).props.className).toBeUndefined();
  });

  it('maps every palette tone to its token class', () => {
    for (const tone of ['primary', 'secondary', 'error', 'warning', 'info', 'success'] as const) {
      expect(renderIcon({ name: 'plus', tone }).props.className).toContain(
        `text-palette-${tone}-main`
      );
    }
  });

  // --- Accessibility ---------------------------------------------------------------

  it('exposes an accessibility role and label', () => {
    const element = renderIcon({ name: 'close', accessibilityLabel: 'Close dialog' });
    expect(element.props.accessibilityRole).toBe('image');
    expect(element.props.accessibilityLabel).toBe('Close dialog');
    expect(element.props.accessible).toBe(true);
  });

  it('is hidden from assistive technology when no label makes it decorative', () => {
    const element = renderIcon({ name: 'plus' });
    expect(element.props.accessibilityRole).toBe('none');
    expect(element.props.accessible).toBe(false);
    expect(element.props.accessibilityElementsHidden).toBe(true);
    expect(element.props.importantForAccessibility).toBe('no-hide-descendants');
  });
});
