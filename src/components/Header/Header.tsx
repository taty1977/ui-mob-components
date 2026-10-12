import type { ReactElement } from 'react';
import { Pressable, Text, View } from 'react-native';
import { a11yProps } from '../../utils/a11yProps';
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
  /** Brand mark on the left (hidden while onPressBack is set); replaces the avatar. */
  showLogo?: boolean;
  showStatusIndicator?: boolean;
  statusOnline?: boolean;
  /** Unread notifications; badge over the bell, capped at 99+. */
  unreadCount?: number;
  /** Top safe-area inset in px — pass useSafeAreaInsets().top from the app. */
  topInset?: number;
  onPressBack?: () => void;
  onPressProfile?: () => void;
  /** When set, a search button shows on the right, before the bell. */
  onPressSearch?: () => void;
  onPressNotification?: () => void;
  className?: string;
};

// Visuals hidden from AT: visible text inside a labeled control trips
// label-content-name-mismatch (the Pressable label already describes it).
const DECORATIVE = a11yProps(true);

// --- Component ---------------------------------------------------------------------

/** App header: logo (or back button), title/greeting, profile avatar, and
 * optional search/notification actions. All colors are theme-adaptive. */
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
  onPressSearch,
  onPressNotification,
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

  // Badge text and the accessible name must contain the same value.
  const badgeText = unreadCount > 99 ? '99+' : String(unreadCount);

  return (
    <View
      className={['bg-background-surface border-b border-divider px-4 pb-3', className]
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
            hitSlop={8}
            className="-ml-2 -mr-2 text-text-primary"
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

        <View className="flex-row items-center gap-0">
          {onPressSearch ? (
            <Pressable
              onPress={onPressSearch}
              accessibilityRole="button"
              accessibilityLabel="Search"
              hitSlop={8}
              className="items-center justify-center text-text-primary"
            >
              <Icon name="magnifier" size="lg" tone="inherit" />
            </Pressable>
          ) : null}

          <Pressable
            onPress={onPressNotification}
            accessibilityRole="button"
            accessibilityLabel={
              unreadCount > 0 ? `Notifications, ${badgeText} unread` : 'Notifications'
            }
            hitSlop={8}
            className="items-center justify-center text-text-primary"
          >
            <Icon name="bell" size="lg" tone="inherit" />
            {unreadCount > 0 ? (
              <View
                {...DECORATIVE}
                className="absolute -top-1 -right-0.5 min-w-4 h-4 px-1 rounded-full items-center justify-center bg-error-800"
              >
                <Text className="text-[9px] font-bold text-misc-bg-white">
                  {badgeText}
                </Text>
              </View>
            ) : null}
          </Pressable>

        </View>
      </View>
    </View>
  );
}
