import type { ReactElement } from 'react';
import { Pressable, Text } from 'react-native';

import { paletteToneStyles, type NavigationTone } from '../../themes/paletteTones';
import { Icon, type IconName } from '../Icon';

export type NavItem = {
  label: string;
  /** Registry icon shown before the label. */
  icon?: IconName;
  /** Error tone for destructive actions. */
  destructive?: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

export type NavItemSize = 'sm' | 'md';

export type NavItemRowProps = {
  item: NavItem;
  /** Theme tone for hover/focus/press tint and hovered text; destructive items use error. */
  tone: NavigationTone;
  /** sm = compact Menu rows; md = roomier Drawer rows. */
  size?: NavItemSize;
  /** Fired after item.onPress. */
  onSelect: () => void;
};

const rowSizeClasses: Record<NavItemSize, string> = {
  sm: 'gap-3 px-4 py-2.5',
  md: 'gap-3 px-4 py-3',
};

/** Pressable icon + label row shared by Menu and Drawer, with tone-based hover. */
export function NavItemRow({ item, tone, size = 'sm', onSelect }: NavItemRowProps): ReactElement {
  const toneStyle = paletteToneStyles[item.destructive ? 'error' : tone];
  const hoverText = item.disabled ? undefined : toneStyle.groupHoverText;

  return (
    <Pressable
      accessibilityRole="menuitem"
      disabled={item.disabled}
      onPress={() => {
        item.onPress?.();
        onSelect();
      }}
      className={[
        'group flex-row items-center text-text-primary',
        rowSizeClasses[size],
        item.disabled ? 'opacity-40' : `${toneStyle.tintState} focus:outline-none`,
      ].join(' ')}
    >
      {item.icon ? (
        <Icon
          name={item.icon}
          size={size}
          tone={item.destructive ? 'error' : 'inherit'}
          className={hoverText}
        />
      ) : null}
      <Text
        className={[
          'text-15',
          item.destructive ? 'text-palette-error-main' : 'text-text-primary',
          hoverText,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {item.label}
      </Text>
    </Pressable>
  );
}
