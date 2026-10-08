import { Pressable, Text, View, type PressableProps } from 'react-native';
import type { ReactNode } from 'react';
import {
  iconGapClasses,
  sizeClasses,
  textSizeClasses,
  toneStyles,
  type ButtonSize,
  type ButtonTone,
  type ButtonVariant,
} from './button.styles';

export type { ButtonSize, ButtonTone, ButtonVariant } from './button.styles';

export type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
};

/** Themed pressable button; all other Pressable props (onPress, onLongPress,
 * accessibilityLabel, ...) pass straight through. */
export function Button({
  label,
  variant = 'default',
  tone = 'primary',
  size = 'md',
  iconLeft,
  iconRight,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const toneStyle = toneStyles[tone];
  // Compose each variant's chrome from the tone's style parts.
  const variantClasses: Record<ButtonVariant, string> = {
    default: `${toneStyle.default} ${toneStyle.defaultState}`,
    label: `${toneStyle.label} ${toneStyle.labelState}`,
    outline: `border bg-transparent ${toneStyle.outline} ${toneStyle.subtleState}`,
    text: `bg-transparent ${toneStyle.subtleState}`,
  };

  const textClasses: Record<ButtonVariant, string> = {
    default: toneStyle.defaultText,
    label: toneStyle.text,
    outline: toneStyle.text,
    text: toneStyle.text,
  };

  const textClassName = ['font-semibold', textClasses[variant], textSizeClasses[size]].join(' ');

  // The icon row carries the text color class so icons using currentColor
  // (tone="inherit") match the label, including on native where inheritance
  // requires a styled ancestor.
  const content = iconLeft || iconRight ? (
    <View className={['flex-row items-center', textClasses[variant], iconGapClasses[size]].join(' ')}>
      {iconLeft}
      <Text className={textClassName}>{label}</Text>
      {iconRight}
    </View>
  ) : (
    <Text className={textClassName}>{label}</Text>
  );

  const classes = [
    'items-center justify-center rounded-md',
    variantClasses[variant],
    sizeClasses[size],
    disabled && 'opacity-45',
    // className merges last so consumers can override.
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Pressable
      accessibilityRole="button"
      className={classes}
      disabled={disabled}
      {...props}
    >
      {content}
    </Pressable>
  );
}
