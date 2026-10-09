import type { ReactElement, ReactNode } from 'react';
import { Image, Pressable } from 'react-native';
import { describe, expect, it, vi } from 'vitest';

import { Avatar } from '../Avatar';
import type { AvatarProps } from '../Avatar';

type AnyElement = ReactElement & { props: Record<string, unknown> };

const renderAvatar = (props: AvatarProps = {}) =>
  Avatar({ name: 'Ana', ...props }) as unknown as AnyElement;

// --- Element-tree helpers ----------------------------------------------------------

// Recursive collect over the element tree (skips text leaves).
const findAll = (node: ReactNode, match: (el: AnyElement) => boolean): AnyElement[] => {
  if (Array.isArray(node)) return node.flatMap((n) => findAll(n, match));
  if (!node || typeof node !== 'object') return [];
  const el = node as AnyElement;
  const children = (el.props as { children?: ReactNode }).children;
  return [...(match(el) ? [el] : []), ...findAll(children, match)];
};

const byClass = (root: ReactNode, fragment: string) =>
  findAll(root, (el) => typeof el.props.className === 'string' && el.props.className.includes(fragment));
const byText = (root: ReactNode, text: unknown) =>
  findAll(root, (el) => el.props.children === text);

describe('Avatar', () => {
  // --- Rendering -----------------------------------------------------------------

  it('shows the image when imageUrl is set, the name initial otherwise', () => {
    const withImage = renderAvatar({ imageUrl: 'https://x.test/a.png' });
    expect(findAll(withImage, (el) => el.type === Image)).toHaveLength(1);
    expect(byText(withImage, 'A')).toHaveLength(0);

    const without = renderAvatar();
    expect(findAll(without, (el) => el.type === Image)).toHaveLength(0);
    expect(byText(without, 'A')).toHaveLength(1);
  });

  it('maps size tokens to px and scales the initial', () => {
    const sized = findAll(renderAvatar({ imageUrl: 'u', size: 'lg' }), (el) => el.type === Image)[0];
    expect(sized.props.style).toMatchObject({ width: 56, height: 56 });

    const initial = byText(renderAvatar({ size: 'lg' }), 'A')[0];
    expect(initial.props.style).toMatchObject({ fontSize: 22 });

    // md is the default at 42px (the header size).
    const fallback = findAll(renderAvatar({ imageUrl: 'u' }), (el) => el.type === Image)[0];
    expect(fallback.props.style).toMatchObject({ width: 42, height: 42 });
  });

  it('colors the status dot and hides it without a status', () => {
    const dot = (status: 'online' | 'offline') =>
      byClass(renderAvatar({ status }), 'border-misc-paper')[0].props.className as string;
    expect(dot('online')).toContain('bg-palette-success-main');
    expect(dot('offline')).toContain('bg-gray-100');
    expect(byClass(renderAvatar(), 'border-misc-paper')).toHaveLength(0);
  });

  // --- Accessibility & interaction -------------------------------------------------

  it('is a button when onPress is set, a plain image otherwise', () => {
    const pressable = renderAvatar({ onPress: vi.fn() });
    expect(pressable.type).toBe(Pressable);
    expect(pressable.props.accessibilityRole).toBe('button');

    const plain = renderAvatar();
    expect(plain.props.accessibilityRole).toBe('image');
  });

  it('labels itself from the name, overridable per use case', () => {
    expect(renderAvatar({ onPress: vi.fn() }).props.accessibilityLabel).toBe("Ana's profile");
    expect(renderAvatar().props.accessibilityLabel).toBe('Ana');
    expect(renderAvatar({ accessibilityLabel: 'Dr. Lee' }).props.accessibilityLabel).toBe('Dr. Lee');
  });

  it('forwards onPress', () => {
    const onPress = vi.fn();
    (renderAvatar({ onPress }).props.onPress as () => void)();
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
