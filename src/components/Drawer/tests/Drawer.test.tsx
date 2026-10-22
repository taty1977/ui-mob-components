import type { ReactElement, ReactNode } from 'react';
import { Modal, Text } from 'react-native';
import { describe, expect, it, vi } from 'vitest';

// Stub react-native-svg (reached via Icon; its source isn't Node-parseable).
vi.mock('react-native-svg', () => {
  const stub = (name: string) => (props: Record<string, unknown>) => ({ type: name, props });
  return { default: stub('Svg'), Path: stub('Path'), Circle: stub('Circle') };
});

import { DrawerView } from '../Drawer';
import type { DrawerViewProps } from '../Drawer';
import { NavItemRow, type NavItemRowProps } from '../../NavItem';

type AnyElement = ReactElement & { props: Record<string, unknown> };

const renderDrawer = (props: Partial<DrawerViewProps> = {}) =>
  DrawerView({ open: true, onClose: vi.fn(), children: <Text>Content</Text>, ...props }) as unknown as AnyElement;

const findAll = (node: ReactNode, match: (el: AnyElement) => boolean): AnyElement[] => {
  if (Array.isArray(node)) return node.flatMap((n) => findAll(n, match));
  if (!node || typeof node !== 'object') return [];
  const el = node as AnyElement;
  const children = (el.props as { children?: ReactNode }).children;
  return [...(match(el) ? [el] : []), ...findAll(children, match)];
};

const byLabel = (root: ReactNode, label: string) =>
  findAll(root, (el) => el.props.accessibilityLabel === label);
const byText = (root: ReactNode, text: unknown) =>
  findAll(root, (el) => el.props.children === text);
const panelOf = (root: ReactNode) =>
  findAll(root, (el) => typeof el.props.className === 'string' && el.props.className.includes('shadow-lg'))[0];

describe('Drawer', () => {
  it('follows open on the Modal visibility', () => {
    const visible = findAll(renderDrawer({ open: true }), (el) => el.type === Modal)[0];
    const hidden = findAll(renderDrawer({ open: false }), (el) => el.type === Modal)[0];
    expect(visible.props.visible).toBe(true);
    expect(hidden.props.visible).toBe(false);
  });

  it('closes on backdrop press and Android back', () => {
    const onClose = vi.fn();
    const drawer = renderDrawer({ onClose });

    (byLabel(drawer, 'Close drawer')[0].props.onPress as () => void)();
    const modal = findAll(drawer, (el) => el.type === Modal)[0];
    (modal.props.onRequestClose as () => void)();

    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('pins the panel to the given side with the given width', () => {
    expect(panelOf(renderDrawer()).props.className).toContain('left-0');

    const right = renderDrawer({ side: 'right', width: 320 });
    expect(panelOf(right).props.className).toContain('right-0');
    expect(panelOf(right).props.style).toEqual([{ width: 320 }, undefined]);
  });

  it('slides the panel on web from the shown state', () => {
    // Test env runs web: translate classes carry the slide.
    expect(panelOf(renderDrawer({ side: 'right' })).props.className).toContain('translate-x-full');
    expect(panelOf(renderDrawer({ side: 'right', shown: true })).props.className).toContain(
      'translate-x-0',
    );
  });

  it('renders a close button inside the panel that fires onClose', () => {
    const onClose = vi.fn();
    const drawer = renderDrawer({ onClose });
    const closers = byLabel(drawer, 'Close drawer');
    expect(closers.length).toBeGreaterThanOrEqual(2);
    // [0] is the backdrop; the panel's close button follows it.
    (closers[1].props.onPress as () => void)();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders the panel content', () => {
    expect(byText(renderDrawer(), 'Content')).toHaveLength(1);
  });

  // --- Items --------------------------------------------------------------------

  const rowsOf = (root: ReactNode) =>
    findAll(root, (el) => el.type === NavItemRow).map((el) => el.props as NavItemRowProps);

  it('renders item rows above children with the drawer tone', () => {
    const drawer = renderDrawer({
      tone: 'secondary',
      items: [{ label: 'Dashboard', icon: 'house' }, { label: 'Labs' }],
    });
    const rows = rowsOf(drawer);
    expect(rows.map((row) => row.item.label)).toEqual(['Dashboard', 'Labs']);
    expect(rows.every((row) => row.tone === 'secondary' && row.size === 'md')).toBe(true);
    expect(byText(drawer, 'Content')).toHaveLength(1);
  });

  it('defaults to the primary tone and renders no rows without items', () => {
    expect(rowsOf(renderDrawer())).toHaveLength(0);
    expect(rowsOf(renderDrawer({ items: [{ label: 'Labs' }] }))[0].tone).toBe('primary');
  });

  it('calls the item handler and closes when an item is selected', () => {
    const onClose = vi.fn();
    const onPress = vi.fn();
    const row = rowsOf(renderDrawer({ onClose, items: [{ label: 'Labs', onPress }] }))[0];
    const pressable = NavItemRow(row) as unknown as AnyElement;

    (pressable.props.onPress as () => void)();

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
