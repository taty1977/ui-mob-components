import type { ReactElement, ReactNode } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { describe, expect, it, vi } from 'vitest';

// Stub react-native-svg (reached via Header and Footer; its source isn't Node-parseable).
vi.mock('react-native-svg', () => {
  const stub = (name: string) => (props: Record<string, unknown>) => ({ type: name, props });
  return { default: stub('Svg'), Path: stub('Path'), Circle: stub('Circle') };
});

// Stub react-native-safe-area-context (its package entry isn't Node-parseable;
// the tests only compare the SafeAreaView element type).
vi.mock('react-native-safe-area-context', () => ({
  SafeAreaView: (props: Record<string, unknown>) => ({ type: 'SafeAreaView', props }),
}));

import { Screen } from '../Screen';
import type { ScreenProps } from '../Screen';
import { Footer } from '../../Footer';
import { Header } from '../../Header';

type AnyElement = ReactElement & { props: Record<string, unknown> };

const renderScreen = (props: Partial<ScreenProps> = {}) =>
  Screen({ children: 'content', ...props } as ScreenProps) as unknown as AnyElement;

// --- Element-tree helpers ----------------------------------------------------------

// Recursive collect over the element tree (skips text leaves).
const findAll = (node: ReactNode, match: (el: AnyElement) => boolean): AnyElement[] => {
  if (Array.isArray(node)) return node.flatMap((n) => findAll(n, match));
  if (!node || typeof node !== 'object') return [];
  const el = node as AnyElement;
  const children = (el.props as { children?: ReactNode }).children;
  return [...(match(el) ? [el] : []), ...findAll(children, match)];
};

describe('Screen', () => {
  it('renders children in the content area', () => {
    const screen = renderScreen();
    expect(findAll(screen, (el) => el.props.children === 'content')).toHaveLength(1);
  });

  it('renders the header and footer only when their props are set', () => {
    const bare = renderScreen();
    expect(findAll(bare, (el) => el.type === Header)).toHaveLength(0);
    expect(findAll(bare, (el) => el.type === Footer)).toHaveLength(0);

    const screen = renderScreen({ header: {}, footer: {} });
    expect(findAll(screen, (el) => el.type === Header)).toHaveLength(1);
    expect(findAll(screen, (el) => el.type === Footer)).toHaveLength(1);
  });

  it('wraps the screen in a SafeAreaView over a themed frame', () => {
    const screen = renderScreen();
    expect(screen.type).toBe(SafeAreaView);
    expect(screen.props.style).toEqual({ flex: 1 });
    expect(screen.props.edges).toEqual(['top', 'bottom']);
    const [frame] = findAll(
      screen,
      (el) => typeof el.props.className === 'string' && el.props.className.includes('bg-background-canvas'),
    );
    expect(frame.props.className).toContain('flex-1');
  });

  it('renders children inside a ScrollView content container', () => {
    const screen = renderScreen();
    const [scroll] = findAll(screen, (el) => el.type === ScrollView);
    expect(scroll.props.contentContainerClassName).toContain('px-4');
    expect(findAll(scroll, (el) => el.props.children === 'content')).toHaveLength(1);
  });

  it('renders a plain content View instead when scrollable is false', () => {
    const screen = renderScreen({ scrollable: false });
    expect(findAll(screen, (el) => el.type === ScrollView)).toHaveLength(0);
    const [contentArea] = findAll(screen, (el) => el.props.children === 'content');
    expect(contentArea.props.className).toContain('flex-1');
  });

  it('spreads the header and footer props through', () => {
    const screen = renderScreen({
      header: { title: 'Today' },
      footer: { variant: 'meta', copyright: '© Acme' },
    });
    const [header] = findAll(screen, (el) => el.type === Header);
    expect(header.props.title).toBe('Today');
    const [footer] = findAll(screen, (el) => el.type === Footer);
    expect(footer.props.variant).toBe('meta');
    expect(footer.props.copyright).toBe('© Acme');
  });

  it('applies consumer classes to the frame and the content container', () => {
    const screen = renderScreen({ className: 'pt-4', contentClassName: 'gap-4' });
    const [frame] = findAll(
      screen,
      (el) => typeof el.props.className === 'string' && el.props.className.includes('bg-background-canvas'),
    );
    expect(frame.props.className).toContain('pt-4');
    const [scroll] = findAll(screen, (el) => el.type === ScrollView);
    expect(scroll.props.contentContainerClassName).toContain('gap-4');
  });
});
