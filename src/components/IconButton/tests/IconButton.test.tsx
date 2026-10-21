import type { ReactElement, ReactNode } from 'react';
import { Pressable } from 'react-native';
import { describe, expect, it, vi } from 'vitest';

// Stub react-native-svg (reached via Icon; its source isn't Node-parseable).
vi.mock('react-native-svg', () => {
  const stub = (name: string) => (props: Record<string, unknown>) => ({ type: name, props });
  return { default: stub('Svg'), Path: stub('Path') };
});

import { Icon } from '../../Icon';
import { IconButton } from '../IconButton';
import type { IconButtonProps } from '../IconButton';

type AnyElement = ReactElement & { props: Record<string, unknown> };

const renderIconButton = (props: Partial<IconButtonProps> = {}) =>
  IconButton({ name: 'plus', accessibilityLabel: 'Add item', ...props }) as unknown as AnyElement;

// --- Element-tree helpers ----------------------------------------------------------

// Recursive collect over the element tree (skips text leaves).
const findAll = (node: ReactNode, match: (el: AnyElement) => boolean): AnyElement[] => {
  if (Array.isArray(node)) return node.flatMap((n) => findAll(n, match));
  if (!node || typeof node !== 'object') return [];
  const el = node as AnyElement;
  const children = (el.props as { children?: ReactNode }).children;
  return [...(match(el) ? [el] : []), ...findAll(children, match)];
};

describe('IconButton', () => {
  // --- Rendering -----------------------------------------------------------------

  it('renders the named registry icon inside a button', () => {
    const root = renderIconButton({ name: 'bell', size: 'lg', tone: 'primary' });
    expect(root.type).toBe(Pressable);
    const icon = findAll(root, (el) => el.type === Icon)[0];
    expect(icon.props).toMatchObject({ name: 'bell', size: 'lg', tone: 'primary' });
  });

  it('defaults to md size and inherit tone', () => {
    const icon = findAll(renderIconButton(), (el) => el.type === Icon)[0];
    expect(icon.props).toMatchObject({ size: 'md', tone: 'inherit' });
  });

  it('renders adornment children after the icon (e.g., a badge)', () => {
    const kids = renderIconButton({ children: 'BADGE' }).props.children as ReactNode[];
    expect((kids[0] as AnyElement).type).toBe(Icon);
    expect(kids[1]).toBe('BADGE');
  });

  // --- Styling ---------------------------------------------------------------------

  it('has a rounded hover/press halo and keeps the icon centered', () => {
    const classes = renderIconButton().props.className as string;
    expect(classes).toContain('rounded-full');
    expect(classes).toContain('hover:bg-action-hover');
    expect(classes).toContain('active:bg-action-selected');
    expect(classes).toContain('items-center');
  });

  it('dims when disabled and forwards the disabled prop', () => {
    const root = renderIconButton({ disabled: true });
    expect(root.props.disabled).toBe(true);
    expect(root.props.className).toContain('opacity-45');
  });

  it('merges className last so consumers can override', () => {
    const classes = renderIconButton({
      className: 'text-text-primary -ml-2',
    }).props.className as string;
    expect(classes.endsWith('text-text-primary -ml-2')).toBe(true);
  });

  // --- Accessibility & interaction -------------------------------------------------

  it('is a named button with a required accessible name', () => {
    const root = renderIconButton();
    expect(root.props.accessibilityRole).toBe('button');
    expect(root.props.accessibilityLabel).toBe('Add item');
  });

  // Tests run on web (react-native-web), so the minimum touch target is 44px.
  it.each([
    ['sm', 8],
    ['md', 6],
    ['lg', 4],
    ['xl', 0],
    ['xxl', 0],
  ] as const)('defaults %s to a %ipx hitSlop reaching the 44px minimum target', (size, slop) => {
    expect(renderIconButton({ size }).props.hitSlop).toBe(slop);
  });

  it('lets consumers override the hitSlop with a number or Insets', () => {
    expect(renderIconButton({ hitSlop: 16 }).props.hitSlop).toBe(16);
    const insets = { top: 4, bottom: 4, left: 12, right: 12 };
    expect(renderIconButton({ hitSlop: insets }).props.hitSlop).toBe(insets);
  });

  it('forwards onPress and other Pressable props', () => {
    const onPress = vi.fn();
    const onLongPress = vi.fn();
    const root = renderIconButton({ onPress, onLongPress });
    (root.props.onPress as () => void)();
    (root.props.onLongPress as () => void)();
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onLongPress).toHaveBeenCalledTimes(1);
  });
});
