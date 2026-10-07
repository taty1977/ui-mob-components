import { describe, expect, it, vi } from 'vitest';

// Stub react-native-svg: these unit tests assert on the props Icon passes,
// not on real SVG rendering (covered by Storybook).
vi.mock('react-native-svg', () => {
  const Svg = (props: Record<string, unknown>) => ({ type: 'Svg', props });
  const Path = (props: Record<string, unknown>) => ({ type: 'Path', props });
  return { default: Svg, Path };
});

import { Icon } from '../Icon';
import { iconPaths, type IconName } from '../paths';

describe('Icon', () => {
  it('renders an SVG for every registered icon name', () => {
    for (const name of Object.keys(iconPaths) as IconName[]) {
      const element = Icon({ name });
      expect(element.props.viewBox).toBe('0 0 24 24');
    }
  });

  it('maps size tokens to pixel dimensions', () => {
    expect(Icon({ name: 'plus', size: 'sm' }).props.width).toBe(16);
    expect(Icon({ name: 'plus', size: 'md' }).props.width).toBe(20);
    expect(Icon({ name: 'plus', size: 'lg' }).props.width).toBe(24);
  });

  it('applies a tone class unless tone is inherit', () => {
    expect(Icon({ name: 'plus', tone: 'primary' }).props.className).toContain('text-light-palette-primary-main');
    expect(Icon({ name: 'plus', tone: 'inherit' }).props.className).toBeUndefined();
  });

  it('uses currentColor fill so icons inherit the surrounding text color', () => {
    expect(Icon({ name: 'plus' }).props.fill).toBe('currentColor');
  });

  it('maps every palette tone to its token class', () => {
    for (const tone of ['primary', 'secondary', 'error', 'warning', 'info', 'success'] as const) {
      expect(Icon({ name: 'plus', tone }).props.className).toContain(`text-light-palette-${tone}-main`);
    }
  });

  it('exposes an accessibility role and label', () => {
    const element = Icon({ name: 'close', accessibilityLabel: 'Close dialog' });
    expect(element.props.accessibilityRole).toBe('image');
    expect(element.props.accessibilityLabel).toBe('Close dialog');
  });
});
