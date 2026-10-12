import { useState, type ReactElement } from 'react';
import { Pressable, View } from 'react-native';

import { BodyText } from '../BodyText';
import type { ButtonTone } from '../Button';
import { Icon } from '../Icon';
import type { IconName } from '../Icon';
import type { TextTone } from '../../utils/text.styles';

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
  /** Label of the active tab; omit to manage internally. */
  activeTab?: string;
  /** Initial active tab when uncontrolled. */
  defaultTab?: string;
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

const BAR_CLASSES = 'bg-background-canvas border-t border-border-subtle px-3';

export type FooterViewProps = FooterProps & {
  /** Resolved active tab label (defaults to activeTab). */
  currentTab?: string;
};

/** Stateless footer; exported so unit tests can drive it without hooks. */
export function FooterView({
  variant = 'tabs',
  tone = 'muted',
  bottomInset = 0,
  className,
  tabs,
  activeTone = 'primary',
  activeTab,
  currentTab,
  onTabPress,
  needHelp,
  termsLine,
  copyright,
  version,
}: FooterViewProps): ReactElement {
  const current = currentTab ?? activeTab;

  if (variant === 'tabs') {
    // Storybook's object control can hand back a non-array; only arrays render tabs.
    const tabList = Array.isArray(tabs) ? tabs : [];
    // IconTone has no 'default'; muted covers it.
    const inactiveIconTone = tone === 'default' ? 'muted' : tone;

    return (
      <View
        className={[BAR_CLASSES, className].filter(Boolean).join(' ')}
        style={{ paddingBottom: bottomInset + 6 }}
      >
        <View className="flex-row" accessibilityRole="tablist">
          {tabList.map((tab) => {
            const active = tab.label === current;
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

/** Compact app footer: tabs bar (default) or centered meta block. Manages the
 * active tab when activeTab is unset. */
export function Footer(props: FooterProps): ReactElement {
  const [internalTab, setInternalTab] = useState(props.defaultTab);
  return (
    <FooterView
      {...props}
      currentTab={props.activeTab ?? internalTab}
      onTabPress={(label) => {
        setInternalTab(label);
        props.onTabPress?.(label);
      }}
    />
  );
}
