import type { ReactElement } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

// --- Types -----------------------------------------------------------------------

export type AvatarStatus = 'online' | 'offline';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';

export type AvatarProps = {
  /** Person's name — drives the initial fallback and the accessibility label. */
  name?: string;
  /** Image URL; falls back to the first letter of name. */
  imageUrl?: string;
  /** Named size token, like Icon sizes (md = 42px). */
  size?: AvatarSize;
  /** Presence dot; hidden when unset. */
  status?: AvatarStatus;
  /** When set, the avatar becomes a button labeled "<name>'s profile". */
  onPress?: () => void;
  accessibilityLabel?: string;
  className?: string;
};

// --- Style constants -------------------------------------------------------------

// Hidden from AT — visible text inside a labeled control trips label-content-name-mismatch.
const DECORATIVE = {
  'aria-hidden': true,
  accessibilityElementsHidden: true,
  importantForAccessibility: 'no-hide-descendants',
} as const;

// px per size token; the dot and initial scale from it.
const SIZE_PX: Record<AvatarSize, number> = { sm: 32, md: 42, lg: 56, xl: 72, xxl: 96 };

// --- Component ---------------------------------------------------------------------

/** Circular avatar: image or name-initial fallback, optional presence dot. */
export function Avatar({
  name = 'User',
  imageUrl,
  size = 'md',
  status,
  onPress,
  accessibilityLabel,
  className,
}: AvatarProps): ReactElement {
  const label = accessibilityLabel ?? (onPress ? `${name}'s profile` : name);
  const px = SIZE_PX[size];
  const dotSize = Math.round(px * 0.3);
  // Never stretch wider than the avatar in flex/block parents.
  const rootClass = ['self-start', className].filter(Boolean).join(' ');

  // Visual tree: image or initial, plus the presence dot.
  const content = (
    // Fixed box: the status dot anchors to it even if a parent stretches the root.
    <View className="relative" style={{ width: px, height: px }} {...DECORATIVE}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          className="rounded-full"
          style={{ width: px, height: px }}
        />
      ) : (
        <View
          className="rounded-full items-center justify-center bg-action-selected"
          style={{ width: px, height: px }}
        >
          <Text
            className="font-bold text-palette-primary-main"
            style={{ fontSize: Math.round(px * 0.4) }}
          >
            {name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      {status ? (
        <View
          className={[
            // Solid gray, not the translucent text-disabled — the image would bleed through.
            'absolute bottom-0 right-0 rounded-full border-2 border-misc-paper',
            status === 'online' ? 'bg-palette-success-main' : 'bg-gray-100',
          ].join(' ')}
          style={{ width: dotSize, height: dotSize }}
        />
      ) : null}
    </View>
  );

  // Button when tappable, static image otherwise.
  const rootProps = {
    accessibilityRole: onPress ? 'button' : 'image',
    accessibilityLabel: label,
    className: rootClass,
  } as const;

  return onPress ? (
    <Pressable onPress={onPress} {...rootProps}>
      {content}
    </Pressable>
  ) : (
    <View {...rootProps}>{content}</View>
  );
}
