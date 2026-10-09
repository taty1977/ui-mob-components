import type { ReactElement, ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

// Stub react-native-svg (reached via Icon; its source isn't Node-parseable).
vi.mock('react-native-svg', () => {
  const stub = (name: string) => (props: Record<string, unknown>) => ({ type: name, props });
  return { default: stub('Svg'), Path: stub('Path'), Circle: stub('Circle') };
});

import { Footer } from '../Footer';
import type { FooterProps, FooterTab } from '../Footer';
import { BodyText } from '../../BodyText';

type AnyElement = ReactElement & { props: Record<string, unknown> };

const renderFooter = (props: FooterProps = {}) =>
  Footer(props) as unknown as AnyElement;

// --- Element-tree helpers ----------------------------------------------------------

// Recursive collect over the element tree (skips text leaves).
const findAll = (node: ReactNode, match: (el: AnyElement) => boolean): AnyElement[] => {
  if (Array.isArray(node)) return node.flatMap((n) => findAll(n, match));
  if (!node || typeof node !== 'object') return [];
  const el = node as AnyElement;
  const children = (el.props as { children?: ReactNode }).children;
  return [...(match(el) ? [el] : []), ...findAll(children, match)];
};

// Matches a text leaf directly or inside a children array (mixed bold/regular text).
const byTextContent = (root: ReactNode, text: string) =>
  findAll(root, (el) => {
    const children = el.props.children;
    return children === text || (Array.isArray(children) && children.includes(text));
  });

const TABS: FooterTab[] = [
  { label: 'Today', icon: 'house' },
  { label: 'Workouts', icon: 'loop' },
  { label: 'Progress', icon: 'success' },
];

describe('Footer', () => {
  // --- Help line ------------------------------------------------------------------------

  it('hides the help line by default and shows it with needHelp', () => {
    expect(byTextContent(renderFooter({ variant: 'meta' }), 'Need help? Call 1-800-555-1234')).toHaveLength(0);
    const footer = renderFooter({ variant: 'meta', needHelp: 'Need help? Call 1-800-555-1234' });
    expect(byTextContent(footer, 'Need help? Call 1-800-555-1234')).toHaveLength(1);
  });

  // --- Terms and privacy line ------------------------------------------------------------

  it('hides the terms line by default and shows termsLine when set', () => {
    expect(byTextContent(renderFooter({ variant: 'meta' }), 'Terms of Service · Privacy Policy')).toHaveLength(0);
    const footer = renderFooter({ variant: 'meta', termsLine: 'Terms of Service · Privacy Policy' });
    expect(byTextContent(footer, 'Terms of Service · Privacy Policy')).toHaveLength(1);
  });

  // --- Meta section --------------------------------------------------------------------

  it('falls back to the brand copyright with the current year', () => {
    const footer = renderFooter({ variant: 'meta' });
    expect(
      byTextContent(footer, `© ${new Date().getFullYear()} AllInOne Health, Inc. All rights reserved.`),
    ).toHaveLength(1);
  });

  it('shows a custom copyright and the version', () => {
    const footer = renderFooter({ variant: 'meta', copyright: '© 2026 Acme', version: 'v2.4.0 (Build 89201)' });
    expect(byTextContent(footer, '© 2026 Acme')).toHaveLength(1);
    expect(byTextContent(footer, 'v2.4.0 (Build 89201)')).toHaveLength(1);
  });

  it('hides the version when not provided', () => {
    const footer = renderFooter({ variant: 'meta', copyright: '© 2026 Acme' });
    expect(byTextContent(footer, '© 2026 Acme')).toHaveLength(1);
    expect(byTextContent(footer, 'v2.4.0 (Build 89201)')).toHaveLength(0);
  });

  // --- Tabs variant (bottom nav bar) -----------------------------------------------------

  it('renders the tab bar by default and the meta block with variant="meta"', () => {
    const tabs = renderFooter({ tabs: TABS });
    expect(byTextContent(tabs, 'Today')).toHaveLength(1);
    expect(byTextContent(tabs, 'Workouts')).toHaveLength(1);
    const meta = renderFooter({ variant: 'meta' });
    expect(
      byTextContent(meta, `© ${new Date().getFullYear()} AllInOne Health, Inc. All rights reserved.`),
    ).toHaveLength(1);
  });

  it('renders the given tabs with the tab role inside a tablist', () => {
    const footer = renderFooter({ variant: 'tabs', tabs: TABS });
    expect(findAll(footer, (el) => el.props.accessibilityRole === 'tab')).toHaveLength(3);
    expect(findAll(footer, (el) => el.props.accessibilityRole === 'tablist')).toHaveLength(1);
  });

  it('marks only the active tab as selected', () => {
    const footer = renderFooter({ variant: 'tabs', tabs: TABS, activeTab: 'Progress' });
    const [progress] = findAll(footer, (el) => el.props.accessibilityLabel === 'Progress');
    expect(progress.props.accessibilityState).toEqual({ selected: true });
    const [today] = findAll(footer, (el) => el.props.accessibilityLabel === 'Today');
    expect(today.props.accessibilityState).toEqual({ selected: false });
  });

  it('tints the active tab with activeTone like Button tones', () => {
    const footer = renderFooter({ variant: 'tabs', tabs: TABS, activeTab: 'Today', activeTone: 'success' });
    const [today] = findAll(footer, (el) => el.props.accessibilityLabel === 'Today');
    const [activeLabel] = findAll(today, (el) => el.type === BodyText);
    expect(activeLabel.props.tone).toBe('success');
    const [workouts] = findAll(footer, (el) => el.props.accessibilityLabel === 'Workouts');
    const [inactiveLabel] = findAll(workouts, (el) => el.type === BodyText);
    expect(inactiveLabel.props.tone).toBe('muted');
  });

  it('calls onTabPress with the tab label', () => {
    const onTabPress = vi.fn();
    const footer = renderFooter({ variant: 'tabs', tabs: TABS, onTabPress });
    const [workouts] = findAll(footer, (el) => el.props.accessibilityLabel === 'Workouts');
    (workouts.props.onPress as () => void)();
    expect(onTabPress).toHaveBeenCalledWith('Workouts');
  });

  it('renders no tabs when tabs is missing or not an array', () => {
    expect(findAll(renderFooter(), (el) => el.props.accessibilityRole === 'tab')).toHaveLength(0);
    const footer = renderFooter({ variant: 'tabs', tabs: 'oops' as unknown as FooterTab[] });
    expect(findAll(footer, (el) => el.props.accessibilityRole === 'tab')).toHaveLength(0);
  });

  it('applies the bottom inset on the tab bar', () => {
    const footer = renderFooter({ bottomInset: 20 });
    expect(footer.props.style).toEqual({ paddingBottom: 26 });
  });

  // --- Tone ---------------------------------------------------------------------------

  it('uses the muted tone by default and a custom tone when set', () => {
    const fallback = renderFooter({ variant: 'meta', needHelp: 'Need help?' });
    const mutedLines = findAll(fallback, (el) => el.type === BodyText);
    expect(mutedLines.length).toBeGreaterThan(0);
    expect(mutedLines.every((el) => el.props.tone === 'muted')).toBe(true);

    const footer = renderFooter({ variant: 'meta', needHelp: 'Need help?', tone: 'secondary' });
    const lines = findAll(footer, (el) => el.type === BodyText);
    expect(lines.every((el) => el.props.tone === 'secondary')).toBe(true);
  });

  // --- Layout --------------------------------------------------------------------------

  it('adds the bottom safe-area inset to the padding', () => {
    const footer = renderFooter({ variant: 'meta', bottomInset: 20 });
    expect(footer.props.style).toEqual({ paddingBottom: 30 });
  });

  it('appends a consumer className to the root', () => {
    const footer = renderFooter({ className: 'mt-8' });
    expect(footer.props.className).toContain('mt-8');
    expect(footer.props.className).toContain('bg-background-canvas');
  });
});
