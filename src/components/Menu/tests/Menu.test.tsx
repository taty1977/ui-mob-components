import type { ReactElement, ReactNode } from 'react';
import { Modal } from 'react-native';
import { describe, expect, it, vi } from 'vitest';

// Stub react-native-svg (reached via Icon; its source isn't Node-parseable).
vi.mock('react-native-svg', () => {
  const Svg = (props: Record<string, unknown>) => ({ type: 'Svg', props });
  const Path = (props: Record<string, unknown>) => ({ type: 'Path', props });
  return { default: Svg, Path };
});

import { MenuView } from '../Menu';
import type { MenuItem, MenuViewProps } from '../Menu';
import { Icon } from '../../Icon';

type AnyElement = ReactElement & { props: Record<string, unknown> };

const demoItems: MenuItem[] = [
  { label: 'Profile', icon: 'user', onPress: vi.fn() },
  { label: 'Premium', disabled: true },
  { label: 'Log out', destructive: true, onPress: vi.fn() },
];

const renderMenu = (props: Partial<MenuViewProps> = {}) =>
  MenuView({ items: demoItems, open: true, onClose: vi.fn(), ...props }) as unknown as AnyElement;

// --- Element-tree helpers ----------------------------------------------------------

// Recursive collect over the element tree (skips text leaves).
const findAll = (node: ReactNode, match: (el: AnyElement) => boolean): AnyElement[] => {
  if (Array.isArray(node)) return node.flatMap((n) => findAll(n, match));
  if (!node || typeof node !== 'object') return [];
  const el = node as AnyElement;
  const children = (el.props as { children?: ReactNode }).children;
  return [...(match(el) ? [el] : []), ...findAll(children, match)];
};

const byRole = (root: ReactNode, role: string) =>
  findAll(root, (el) => el.props.accessibilityRole === role);
const byText = (root: ReactNode, text: unknown) =>
  findAll(root, (el) => el.props.children === text);
const byLabel = (root: ReactNode, label: string) =>
  findAll(root, (el) => el.props.accessibilityLabel === label);

describe('Menu', () => {
  // --- Items ----------------------------------------------------------------------

  it('renders one menuitem per item with its label', () => {
    const menu = renderMenu();
    expect(byRole(menu, 'menuitem')).toHaveLength(3);
    expect(byText(menu, 'Profile')).toHaveLength(1);
    expect(byText(menu, 'Log out')).toHaveLength(1);
  });

  it('renders registry icons, error-toned for destructive items', () => {
    const icons = findAll(renderMenu(), (el) => el.type === Icon);
    expect(icons.map((el) => el.props.name)).toEqual(['user']);
    expect(icons[0].props.tone).toBe('inherit');

    const destructive = renderMenu({ items: [{ label: 'Delete', icon: 'close', destructive: true }] });
    const icon = findAll(destructive, (el) => el.type === Icon)[0];
    expect(icon.props.tone).toBe('error');
    expect((byText(destructive, 'Delete')[0].props.className as string)).toContain(
      'text-palette-error-main'
    );
  });

  it('dims and disables disabled items', () => {
    const disabledRow = byText(renderMenu(), 'Premium')[0];
    const row = findAll(renderMenu(), (el) => el.props.disabled === true)[0];
    expect(disabledRow).toBeTruthy();
    expect((row.props.className as string)).toContain('opacity-40');
  });

  // --- Behavior ---------------------------------------------------------------------

  it('calls the item handler and closes when an item is pressed', () => {
    const onClose = vi.fn();
    const onPress = vi.fn();
    const menu = renderMenu({ items: [{ label: 'Profile', onPress }], onClose });

    (byText(menu, 'Profile')[0] && byRole(menu, 'menuitem')[0].props.onPress as () => void)();

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on backdrop press and Android back', () => {
    const onClose = vi.fn();
    const menu = renderMenu({ onClose });

    (byLabel(menu, 'Close menu')[0].props.onPress as () => void)();
    const modal = findAll(menu, (el) => el.type === Modal)[0];
    (modal.props.onRequestClose as () => void)();

    expect(onClose).toHaveBeenCalledTimes(2);
  });

  // --- Presentation --------------------------------------------------------------------

  it('forwards open to the Modal visibility', () => {
    const visible = findAll(renderMenu({ open: true }), (el) => el.type === Modal)[0];
    const hidden = findAll(renderMenu({ open: false }), (el) => el.type === Modal)[0];
    expect(visible.props.visible).toBe(true);
    expect(hidden.props.visible).toBe(false);
  });

  it('positions the card from the given offset, right-aligned by default', () => {
    const card = byRole(renderMenu({ position: { top: 40, right: 12 } }), 'menu')[0];
    expect(card.props.style).toMatchObject({ top: 40, right: 12 });

    const leftAligned = byRole(renderMenu({ position: { top: 40, left: 20 } }), 'menu')[0];
    expect(leftAligned.props.style).toMatchObject({ top: 40, left: 20 });
  });
});
