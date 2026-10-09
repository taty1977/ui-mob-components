import type { ReactElement } from 'react';
import { Pressable, View } from 'react-native';

import { BodyText } from '../BodyText';
import type { ButtonTone } from '../Button';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';
import type { TextTone } from '../../utils/text.styles';

// --- Types -----------------------------------------------------------------------

/** meta = centered text block; tabs = bottom navigation bar. */
export type FooterVariant = 'meta' | 'tabs';

/** Text tone for the meta lines and inactive tabs. */
export type FooterTone = TextTone;

export type FooterTab = {
  /** Tab label; also the accessibility label and the active-tab key. */
  label: string;
  /** Registry icon shown above the label. */
  icon: IconName;
};

export type FooterProps = {
  // Shared
  /** tabs = bottom navigation bar (default); meta = centered text block. */
  variant?: FooterVariant;
  /** Text tone for the meta lines and inactive tabs. */
  tone?: FooterTone;
  /** Bottom safe-area inset in px — pass useSafeAreaInsets().bottom from the app. */
  bottomInset?: number;
  className?: string;
  // Tabs variant
  /** Tabs for the bottom nav bar; renders an empty bar when unset. */
  tabs?: FooterTab[];
  /** Active tab color, like Button tones. */
  activeTone?: ButtonTone;
  /** Label of the active tab. */
  activeTab?: string;
  /** Called with the pressed tab's label. */
  onTabPress?: (label: string) => void;
  // Meta variant
  /** Help line above the copyright; hidden when empty. */
  needHelp?: string;
  /** Full terms and privacy line; '' hides it. */
  termsLine?: string;
  /** Copyright line; defaults to "© <current year> AllInOne Health, Inc. All rights reserved." */
  copyright?: string;
  /** Build/version text under the copyright line; hidden when empty. */
  version?: string;
};

// --- Component ---------------------------------------------------------------------

// Shared bar frame; the variants differ only in inner padding.
const BAR_CLASSES = 'bg-background-canvas border-t border-border-subtle px-3';

/** Compact app footer: by default (tabs) a bottom navigation bar (pass tabs);
 * variant="meta" renders a centered block with optional help, terms/privacy,
 * copyright, and version lines. All colors come from the adaptive theme classes. */
export function Footer({
  variant = 'tabs',
  tone = 'muted',
  bottomInset = 0,
  className,
  tabs,
  activeTone = 'primary',
  activeTab,
  onTabPress,
  needHelp,
  termsLine,
  copyright,
  version,
}: FooterProps): ReactElement {
  // variant="tabs": bottom navigation bar.
  if (variant === 'tabs') {
    // Never trust external input (e.g. Storybook's object control can hand back a
    // non-array): anything that isn't an array renders no tabs.
    const tabList = Array.isArray(tabs) ? tabs : [];
    // IconTone has no 'default'; muted is the inactive icon color in that case.
    const inactiveIconTone = tone === 'default' ? 'muted' : tone;

    return (
      <View
        className={[BAR_CLASSES, className].filter(Boolean).join(' ')}
        style={{ paddingBottom: bottomInset + 6 }}
      >
        <View className="flex-row" accessibilityRole="tablist">
          {tabList.map((tab) => {
            const active = tab.label === activeTab;
            return (
              <Pressable
                key={tab.label}
                onPress={() => onTabPress?.(tab.label)}
                accessibilityRole="tab"
                accessibilityLabel={tab.label}
                accessibilityState={{ selected: active }}
                className="flex-1 items-center gap-0.5 pt-2 pb-1"
              >
                <Icon
                  name={tab.icon}
                  size="lg"
                  tone={active ? activeTone : inactiveIconTone}
                />
                <BodyText
                  variant="caption"
                  tone={active ? activeTone : tone}
                  weight={active ? 'semibold' : 'regular'}
                >
                  {tab.label}
                </BodyText>
              </Pressable>
            );
          })}
        </View>
      </View>
    );
  }

  // variant="meta": centered help/terms/copyright/version lines.
  const year = new Date().getFullYear();

  return (
    <View
      className={[BAR_CLASSES, 'pt-2.5 gap-2', className].filter(Boolean).join(' ')}
      style={{ paddingBottom: bottomInset + 10 }}
    >
      <View className="items-center pt-1 gap-2">
        {needHelp ? (
          <BodyText variant="caption" tone={tone} className="text-center">
            {needHelp}
          </BodyText>
        ) : null}
        {termsLine ? (
          <BodyText variant="caption" tone={tone} className="text-center">
            {termsLine}
          </BodyText>
        ) : null}
        <BodyText variant="caption" tone={tone} className="text-center">
          {copyright ?? `© ${year} AllInOne Health, Inc. All rights reserved.`}
        </BodyText>
        {version ? (
          <BodyText variant="caption" tone={tone} className="text-center">
            {version}
          </BodyText>
        ) : null}
      </View>
    </View>
  );
}
