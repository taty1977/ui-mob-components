import type { ReactElement, ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Footer } from '../Footer';
import type { FooterProps } from '../Footer';
import { Header } from '../Header';
import type { HeaderProps } from '../Header';

// --- Types -----------------------------------------------------------------------

export type ScreenProps = {
  /** Screen content. */
  children: ReactNode;
  /** Header props; the header is hidden when unset. */
  header?: HeaderProps;
  /** Footer props; the footer is hidden when unset. */
  footer?: FooterProps;
  /** Wrap the content in a ScrollView (default true). Set false when the content
   * scrolls itself (e.g. a FlatList). */
  scrollable?: boolean;
  className?: string;
  /** Extra classes for the content area (the ScrollView content container, or the
   * plain content View when scrollable is false). */
  contentClassName?: string;
};

// --- Component ---------------------------------------------------------------------

// SafeAreaView from safe-area-context isn't a core RN component, so NativeWind
// doesn't process className on it — it gets plain style, and the themed frame is
// the inner View.
const rootStyle = { flex: 1 } as const;

// Web a11y (axe scrollable-region-focusable): the scroll region must be
// keyboard-focusable. RN types don't know tabIndex, and native ignores it.
const scrollRegionA11y = { tabIndex: 0 } as object;

/** App screen scaffold inside a SafeAreaView (react-native-safe-area-context):
 * optional Header on top, a scrollable content area, and an optional Footer at the
 * bottom. The consuming app must wrap its root in SafeAreaProvider. Per-platform
 * inset overrides can still ride the header/footer props (topInset/bottomInset). */
export function Screen({
  children,
  header,
  footer,
  scrollable = true,
  className,
  contentClassName,
}: ScreenProps): ReactElement {
  const contentClasses = ['px-4', contentClassName].filter(Boolean).join(' ');

  return (
    <SafeAreaView style={rootStyle} edges={['top', 'bottom']}>
      <View className={['flex-1 bg-background-canvas', className].filter(Boolean).join(' ')}>
        {header ? <Header {...header} /> : null}
        {scrollable ? (
          <ScrollView
            className="flex-1"
            contentContainerClassName={contentClasses}
            {...scrollRegionA11y}
          >
            {children}
          </ScrollView>
        ) : (
          <View className={['flex-1', contentClasses].join(' ')}>{children}</View>
        )}
        {footer ? <Footer {...footer} /> : null}
      </View>
    </SafeAreaView>
  );
}
