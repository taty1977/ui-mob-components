import type { ReactElement, ReactNode } from 'react';
import { Platform, Pressable, type PressableProps } from 'react-native';
import {
  Icon,
  iconSizeValues,
  type IconName,
  type IconSize,
  type IconTone,
} from '../Icon';

export type IconButtonProps = Omit<
  PressableProps,
  'children' | 'accessibilityLabel' | 'hitSlop'
> & {
  /** Registry icon to render. */
  name: IconName;
  /** Icon size token (md = 20px). */
  size?: IconSize;
  /** Theme-adaptive color; 'inherit' follows the surrounding text color — set a
   * text-* class via className (or a themed ancestor) when using it. */
  tone?: IconTone;
  /** Accessible name — required: icon-only buttons must be named. */
  accessibilityLabel: string;
  /** Adornment rendered after the icon inside the button (e.g., a badge). */
  children?: ReactNode;
  /** Extra NativeWind classes on the Pressable, merged last. */
  className?: string;
  /** Extra touch area beyond the visual bounds. Defaults to the slop that grows
   * the button to the platform minimum touch target (44pt iOS/web, 48dp Android)
   * for the chosen size; pass a number or Insets to override. */
  hitSlop?: PressableProps['hitSlop'];
};

// Platform minimum touch target: 44pt (iOS HIG / WCAG AAA), 48dp (Material).
const minTargetSize = Platform.select({ android: 48, default: 44 });

// p-1.5 = 6px of padding on each side of the icon.
const BUTTON_PADDING = 6;

/** Slop growing the visual button (icon + padding) to the platform minimum target. */
const defaultHitSlop = (size: IconSize): number =>
  Math.max(0, Math.ceil((minTargetSize - iconSizeValues[size] - 2 * BUTTON_PADDING) / 2));

/** Pressable registry icon with a rounded hover/press halo, a size-aware hitSlop
 * that guarantees the platform minimum touch target, and a required accessible
 * name. All other Pressable props (onLongPress, ...) pass straight through. */
export function IconButton({
  name,
  size = 'md',
  tone = 'inherit',
  accessibilityLabel,
  children,
  className,
  disabled,
  hitSlop,
  ...props
}: IconButtonProps): ReactElement {
  const slop = hitSlop ?? defaultHitSlop(size);
  const classes = [
    'items-center justify-center self-center rounded-full p-1.5',
    'hover:bg-action-hover focus:bg-action-hover active:bg-action-selected',
    disabled && 'opacity-45',
    // className merges last so consumers can override.
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={slop}
      disabled={disabled}
      className={classes}
      {...props}
    >
      <Icon name={name} size={size} tone={tone} />
      {children}
    </Pressable>
  );
}
