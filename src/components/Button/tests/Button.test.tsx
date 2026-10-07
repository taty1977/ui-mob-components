import { describe, expect, it, vi } from 'vitest';

// Stub react-native-svg: these unit tests assert on structure and classes,
// not on real SVG rendering (covered by Storybook).
vi.mock('react-native-svg', () => {
  const Svg = (props: Record<string, unknown>) => ({ type: 'Svg', props });
  const Path = (props: Record<string, unknown>) => ({ type: 'Path', props });
  return { default: Svg, Path };
});

import { Button } from '../Button';
import type { ButtonProps, ButtonTone, ButtonVariant } from '../Button';

const tones: ButtonTone[] = ['primary', 'secondary', 'error', 'warning', 'info', 'success'];
const variants: ButtonVariant[] = ['default', 'label', 'outline', 'text'];

describe('Button', () => {
  it('renders the label text', () => {
    const props: ButtonProps = { label: 'Continue' };
    const element = Button(props);
    expect(element).toBeTruthy();
    expect(element.props.children.props.children).toBe('Continue');
  });

  it('renders left and right icons around the label when provided', () => {
    const element = Button({
      label: 'Continue',
      iconLeft: '←',
      iconRight: '→',
    });
    const row = element.props.children;
    const [left, label, right] = row.props.children;
    expect(left).toBe('←');
    expect(label.props.children).toBe('Continue');
    expect(right).toBe('→');
  });

  it('renders only the requested side icon', () => {
    const leftOnly = Button({ label: 'Back', iconLeft: '←' });
    expect(leftOnly.props.children.props.children[2]).toBeUndefined();

    const rightOnly = Button({ label: 'Next', iconRight: '→' });
    expect(rightOnly.props.children.props.children[0]).toBeUndefined();
  });

  it('renders without the icon row when no icons are provided', () => {
    const element = Button({ label: 'Continue' });
    expect(element.props.children.type).not.toBe('View');
  });

  it('applies the variant text color to the icon row so icons inherit it', () => {
    const outline = Button({ label: 'Continue', tone: 'error', variant: 'outline', iconLeft: '←' });
    expect(outline.props.children.props.className).toContain('text-light-palette-error-main');

    const solid = Button({ label: 'Continue', tone: 'primary', iconLeft: '←' });
    expect(solid.props.children.props.className).toContain('text-light-misc-bg-white');
  });

  it('applies the button accessibility role', () => {
    const element = Button({ label: 'Continue' });
    expect(element.props.accessibilityRole).toBe('button');
  });

  it('accepts every tone and variant combination', () => {
    for (const tone of tones) {
      for (const variant of variants) {
        const element = Button({ label: 'Continue', tone, variant });
        expect(element.props.className).toBeTruthy();
      }
    }
  });

  it('marks disabled buttons with reduced opacity', () => {
    const element = Button({ label: 'Continue', disabled: true });
    expect(element.props.disabled).toBe(true);
    expect(element.props.className).toContain('opacity-45');
  });
});
