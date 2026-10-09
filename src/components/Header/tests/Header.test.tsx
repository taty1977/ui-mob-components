import type { ReactElement, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

// Stub react-native-svg (reached via Icon and Logo; its source isn't Node-parseable).
vi.mock('react-native-svg', () => {
  const stub = (name: string) => (props: Record<string, unknown>) => ({ type: name, props });
  return { default: stub('Svg'), Path: stub('Path'), Circle: stub('Circle') };
});

import { Header } from '../Header';
import type { HeaderProps } from '../Header';
import { Avatar } from '../../Avatar';
import { Logo } from '../../Logo';

type AnyElement = ReactElement & { props: Record<string, unknown> };

const renderHeader = (props: HeaderProps = {}) =>
  Header({ userName: 'Ana', ...props }) as unknown as AnyElement;

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
const byLabel = (root: ReactNode, label: string) =>
  findAll(root, (el) => el.props.accessibilityLabel === label);
const kidsOf = (el: AnyElement) => {
  const children = el.props.children as ReactNode;
  return (Array.isArray(children) ? children : [children]).filter(Boolean) as AnyElement[];
};

describe('Header', () => {
  // --- Title area ------------------------------------------------------------------

  it('greets the user when no title is given', () => {
    const header = renderHeader();
    expect(byText(header, 'Hello, Ana')).toHaveLength(1);
  });

  it('shows the title and subtitle instead of the greeting when provided', () => {
    const header = renderHeader({ title: 'Appointments', subtitle: 'This week' });
    expect(byText(header, 'Appointments')).toHaveLength(1);
    expect(byText(header, 'This week')).toHaveLength(1);
    expect(byText(header, 'Hello, Ana')).toHaveLength(0);
  });

  it('omits the subtitle line when not provided', () => {
    const header = renderHeader();
    expect(byClass(header, 'text-13 text-text-secondary mt-0.5')).toHaveLength(0);
  });

  // --- Left section ------------------------------------------------------------------

  it('shows the logo by default, a back button with onPressBack, the avatar otherwise', () => {
    expect(findAll(renderHeader(), (el) => el.type === Logo)).toHaveLength(1);

    const withBack = renderHeader({ onPressBack: vi.fn() });
    expect(byLabel(withBack, 'Go back')).toHaveLength(1);
    expect(findAll(withBack, (el) => el.type === Logo)).toHaveLength(0);

    const noLogo = renderHeader({ showLogo: false });
    expect(findAll(noLogo, (el) => el.type === Logo)).toHaveLength(0);
    expect(findAll(noLogo, (el) => el.type === Avatar)).toHaveLength(1);
  });

  it('moves the avatar to the right of the title when the logo shows', () => {
    const header = renderHeader();
    const row = byClass(header, 'flex-row items-center gap-3')[0];
    const kids = kidsOf(row);
    const logoIndex = kids.findIndex((el) => el.type === Logo);
    const avatarIndex = kids.findIndex((el) => el.type === Avatar);
    expect(logoIndex).toBeGreaterThanOrEqual(0);
    expect(avatarIndex).toBeGreaterThan(logoIndex);
  });

  // --- Avatar ------------------------------------------------------------------------

  it('passes the user name and image down to the avatar', () => {
    const avatar = findAll(renderHeader({ userAvatarUrl: 'x.png' }), (el) => el.type === Avatar)[0];
    expect(avatar.props.name).toBe('Ana');
    expect(avatar.props.imageUrl).toBe('x.png');
  });

  it('maps the status flags to the avatar status', () => {
    const statusOf = (props: HeaderProps) =>
      findAll(renderHeader(props), (el) => el.type === Avatar)[0].props.status;
    expect(statusOf({ statusOnline: true })).toBe('online');
    expect(statusOf({ statusOnline: false })).toBe('offline');
    expect(statusOf({ showStatusIndicator: false })).toBeUndefined();
  });

  // --- Notifications -------------------------------------------------------------------

  it('caps the unread badge at 99+ and hides it at zero', () => {
    expect(byText(renderHeader({ unreadCount: 120 }), '99+')).toHaveLength(1);
    expect(byText(renderHeader({ unreadCount: 3 }), 3)).toHaveLength(1);
    expect(byClass(renderHeader({ unreadCount: 0 }), 'bg-palette-error-main')).toHaveLength(0);
  });

  it('labels the bell with the unread count', () => {
    expect(byLabel(renderHeader({ unreadCount: 3 }), 'Notifications, 3 unread')).toHaveLength(1);
    expect(byLabel(renderHeader(), 'Notifications')).toHaveLength(1);
  });

  // --- Behavior -----------------------------------------------------------------------

  it('forwards presses to the back, profile, and notification callbacks', () => {
    const onPressBack = vi.fn();
    const onPressProfile = vi.fn();
    const onPressNotification = vi.fn();
    const header = renderHeader({ onPressBack, onPressProfile, onPressNotification });

    (byLabel(header, 'Go back')[0].props.onPress as () => void)();
    (byLabel(header, 'Notifications')[0].props.onPress as () => void)();
    // Back mode hides the avatar, so profile comes from the default layout.
    const avatar = findAll(renderHeader({ onPressProfile }), (el) => el.type === Avatar)[0];
    (avatar.props.onPress as () => void)();

    expect(onPressBack).toHaveBeenCalledTimes(1);
    expect(onPressNotification).toHaveBeenCalledTimes(1);
    expect(onPressProfile).toHaveBeenCalledTimes(1);
  });

  it('shows a burger button that forwards onPressMenu when set', () => {
    const onPressMenu = vi.fn();
    expect(byLabel(renderHeader(), 'Open menu')).toHaveLength(0);

    const header = renderHeader({ onPressMenu });
    (byLabel(header, 'Open menu')[0].props.onPress as () => void)();
    expect(onPressMenu).toHaveBeenCalledTimes(1);
  });

  it('adds the top inset to the container padding', () => {
    const header = renderHeader({ topInset: 20 });
    expect((header.props.style as { paddingTop: number }).paddingTop).toBe(28);
  });
});
