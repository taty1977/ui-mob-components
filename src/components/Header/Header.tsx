import type { ReactElement } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Avatar } from '../Avatar';
import { Icon } from '../Icon';
import { Logo } from '../Logo';

// --- Types -----------------------------------------------------------------------

export type HeaderProps = {
  /** Screen title; falls back to a greeting with userName. */
  title?: string;
  subtitle?: string;
  userName?: string;
  userAvatarUrl?: string;
  /** Brand mark on the left (hidden while onPressBack is set); moves the avatar right. */
  showLogo?: boolean;
  showStatusIndicator?: boolean;
  statusOnline?: boolean;
  /** Unread notifications; badge over the bell, capped at 99+. */
  unreadCount?: number;
  /** Top safe-area inset in px — pass useSafeAreaInsets().top from the app. */
  topInset?: number;
  onPressBack?: () => void;
  onPressProfile?: () => void;
  onPressNotification?: () => void;
  /** When set, a burger-menu button shows at the right end. */
  onPressMenu?: () => void;
  className?: string;
};

// Visuals hidden from AT: visible text inside a labeled control trips
// label-content-name-mismatch (the Pressable label already describes it).
const DECORATIVE = {
  'aria-hidden': true,
  accessibilityElementsHidden: true,
  importantForAccessibility: 'no-hide-descendants',
} as const;

// --- Component ---------------------------------------------------------------------

/** App header: logo (or back button), title/greeting, profile avatar, and a
 * notification bell. All colors come from the adaptive theme classes. */
export function Header({
  title,
  subtitle,
  userName = 'Patient',
  userAvatarUrl,
  showLogo = true,
  showStatusIndicator = true,
  statusOnline = true,
  unreadCount = 0,
  topInset = 0,
  onPressBack,
  onPressProfile,
  onPressNotification,
  onPressMenu,
  className,
}: HeaderProps): ReactElement {
  const avatar = (
    <Avatar
      name={userName}
      imageUrl={userAvatarUrl}
      status={showStatusIndicator ? (statusOnline ? 'online' : 'offline') : undefined}
      onPress={onPressProfile}
    />
  );

  // With the logo (and no back button) the avatar shifts to the action side.
  const avatarRight = showLogo && !onPressBack;

  return (
    <View
      className={['bg-misc-paper border-b border-divider px-4 pb-3', className]
        .filter(Boolean)
        .join(' ')}
      style={{ paddingTop: topInset + 8 }}
    >
      <View className="flex-row items-center gap-3">
        {onPressBack ? (
          <Pressable
            onPress={onPressBack}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            className="w-10 h-10 rounded-lg bg-misc-body-bg items-center justify-center text-text-primary"
          >
            <Icon name="chevron-left" size="lg" tone="inherit" />
          </Pressable>
        ) : showLogo ? (
          <Logo variant="icon" size={32} />
        ) : (
          avatar
        )}

        <View className="flex-1">
          <Text numberOfLines={1} className="text-18 font-bold text-text-primary">
            {title || `Hello, ${userName}`}
          </Text>
          {subtitle ? (
            <Text numberOfLines={1} className="text-13 text-text-secondary mt-0.5">
              {subtitle}
            </Text>
          ) : null}
        </View>

        {avatarRight ? avatar : null}

        <Pressable
          onPress={onPressNotification}
          accessibilityRole="button"
          accessibilityLabel={
            unreadCount > 0 ? `Notifications, ${unreadCount} unread` : 'Notifications'
          }
          className="w-10 h-10 rounded-lg bg-misc-body-bg items-center justify-center text-text-primary"
        >
          <Icon name="bell" size="md" tone="inherit" />
          {unreadCount > 0 ? (
            <View
              {...DECORATIVE}
              className="absolute top-1 right-1 min-w-4 h-4 px-1 rounded-full items-center justify-center bg-palette-error-main"
            >
              <Text className="text-[9px] font-bold text-misc-bg-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </Text>
            </View>
          ) : null}
        </Pressable>

        {onPressMenu ? (
          <Pressable
            onPress={onPressMenu}
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            className="w-10 h-10 rounded-lg bg-misc-body-bg items-center justify-center text-text-primary"
          >
            <Icon name="burger-menu" size="md" tone="inherit" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
