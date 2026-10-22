import type { ReactElement, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

// Stub react-native-svg (reached via Icon; its source isn't Node-parseable).
vi.mock('react-native-svg', () => {
  const stub = (name: string) => (props: Record<string, unknown>) => ({ type: name, props });
  return { default: stub('Svg'), Path: stub('Path'), Circle: stub('Circle') };
});

vi.mock('react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react')>();
  // Hooks outside a renderer: a plain ref object is enough for the story helper.
  return { ...actual, useRef: <T,>(initial: T) => ({ current: initial }) };
});

import { NavItemRow, type NavItemRowProps } from '../NavItem';
import { useSingleActionLog } from '../stories/useSingleActionLog';
import { Icon } from '../../Icon';

type AnyElement = ReactElement & { props: Record<string, unknown> };

const renderRow = (props: Partial<NavItemRowProps> = {}) =>
  NavItemRow({
    item: { label: 'Profile', icon: 'user' },
    tone: 'primary',
    onSelect: vi.fn(),
    ...props,
  }) as unknown as AnyElement;

const findAll = (node: ReactNode, match: (el: AnyElement) => boolean): AnyElement[] => {
  if (Array.isArray(node)) return node.flatMap((n) => findAll(n, match));
  if (!node || typeof node !== 'object') return [];
  const el = node as AnyElement;
  const children = (el.props as { children?: ReactNode }).children;
  return [...(match(el) ? [el] : []), ...findAll(children, match)];
};

const classOf = (el: AnyElement) => el.props.className as string;
const labelOf = (row: AnyElement, text: string) =>
  findAll(row, (el) => el.props.children === text)[0];

describe('NavItemRow', () => {
  it('tints the row and text with the tone on hover, focus, and press', () => {
    for (const tone of ['primary', 'secondary'] as const) {
      const row = renderRow({ tone });
      expect(classOf(row)).toContain(`hover:bg-palette-${tone}-opacity-light `);
      expect(classOf(row)).toContain(`focus:bg-palette-${tone}-opacity-light `);
      expect(classOf(row)).toContain(`active:bg-palette-${tone}-opacity-main`);
      expect(classOf(labelOf(row, 'Profile'))).toContain(`group-hover:text-palette-${tone}-main`);
      const icon = findAll(row, (el) => el.type === Icon)[0];
      expect(icon.props.className).toContain(`group-hover:text-palette-${tone}-main`);
    }
  });

  it('uses the error tone for destructive items', () => {
    const row = renderRow({ tone: 'secondary', item: { label: 'Log out', destructive: true } });
    expect(classOf(row)).toContain('hover:bg-palette-error-opacity-light ');
    expect(classOf(labelOf(row, 'Log out'))).toContain('text-palette-error-main');
  });

  it('dims disabled items without hover states', () => {
    const row = renderRow({ item: { label: 'Premium', disabled: true } });
    expect(row.props.disabled).toBe(true);
    expect(classOf(row)).toContain('opacity-40');
    expect(classOf(row)).not.toContain('hover:');
    expect(classOf(labelOf(row, 'Premium'))).not.toContain('group-hover:');
  });

  it('sizes rows and icons for Menu (sm) and Drawer (md)', () => {
    const sm = renderRow();
    const md = renderRow({ size: 'md' });
    expect(classOf(sm)).toContain('py-2.5');
    expect(classOf(md)).toContain('py-3');
    expect(findAll(md, (el) => el.type === Icon)[0].props.size).toBe('md');
  });

  it('fires the item handler, then onSelect', () => {
    const calls: string[] = [];
    const row = renderRow({
      item: { label: 'Profile', onPress: () => calls.push('item') },
      onSelect: () => calls.push('select'),
    });
    (row.props.onPress as () => void)();
    expect(calls).toEqual(['item', 'select']);
  });
});

describe('useSingleActionLog (stories)', () => {
  it('logs onPress only for item selection and onClose only for dismissals', () => {
    const onPress = vi.fn();
    const onClose = vi.fn();
    const logged = useSingleActionLog([{ label: 'Profile', onPress }], onClose);

    // Item selection: the item fires, then the component closes.
    logged.items?.[0].onPress?.();
    logged.onClose();
    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();

    // Dismissal (backdrop / back): onClose logs once.
    logged.onClose();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
