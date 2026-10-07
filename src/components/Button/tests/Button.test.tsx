import { describe, expect, it } from 'vitest';
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
