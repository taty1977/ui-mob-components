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

  it('hides the avatar while the logo shows', () => {
    expect(findAll(renderHeader(), (el) => el.type === Avatar)).toHaveLength(0);
  });

  // --- Avatar ------------------------------------------------------------------------

  it('passes the user name and image down to the avatar', () => {
    const avatar = findAll(renderHeader({ showLogo: false, userAvatarUrl: 'x.png' }), (el) => el.type === Avatar)[0];
    expect(avatar.props.name).toBe('Ana');
    expect(avatar.props.imageUrl).toBe('x.png');
  });

  it('maps the status flags to the avatar status', () => {
    const statusOf = (props: HeaderProps) =>
      findAll(renderHeader({ showLogo: false, ...props }), (el) => el.type === Avatar)[0].props.status;
    expect(statusOf({ statusOnline: true })).toBe('online');
    expect(statusOf({ statusOnline: false })).toBe('offline');
    expect(statusOf({ showStatusIndicator: false })).toBeUndefined();
  });

  // --- Notifications -------------------------------------------------------------------

  it('caps the unread badge at 99+ and hides it at zero', () => {
    expect(byText(renderHeader({ unreadCount: 120 }), '99+')).toHaveLength(1);
    expect(byText(renderHeader({ unreadCount: 3 }), '3')).toHaveLength(1);
    expect(byClass(renderHeader({ unreadCount: 0 }), 'bg-error-800')).toHaveLength(0);
  });

  it('labels the bell with the unread count', () => {
    expect(byLabel(renderHeader({ unreadCount: 3 }), 'Notifications, 3 unread')).toHaveLength(1);
    expect(byLabel(renderHeader({ unreadCount: 120 }), 'Notifications, 99+ unread')).toHaveLength(1);
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
    const avatar = findAll(renderHeader({ showLogo: false, onPressProfile }), (el) => el.type === Avatar)[0];
    (avatar.props.onPress as () => void)();

    expect(onPressBack).toHaveBeenCalledTimes(1);
    expect(onPressNotification).toHaveBeenCalledTimes(1);
    expect(onPressProfile).toHaveBeenCalledTimes(1);
  });

  it('shows a search button that forwards onPressSearch when set', () => {
    const onPressSearch = vi.fn();
    expect(byLabel(renderHeader(), 'Search')).toHaveLength(0);

    const header = renderHeader({ onPressSearch });
    (byLabel(header, 'Search')[0].props.onPress as () => void)();
    expect(onPressSearch).toHaveBeenCalledTimes(1);
  });

  it('adds the top inset to the container padding', () => {
    const header = renderHeader({ topInset: 20 });
    expect((header.props.style as { paddingTop: number }).paddingTop).toBe(28);
  });
});
