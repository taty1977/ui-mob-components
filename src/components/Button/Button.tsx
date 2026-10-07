import { Pressable, Text, View, type PressableProps } from 'react-native';
import type { ReactNode } from 'react';

export type ButtonTone = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
export type ButtonVariant = 'default' | 'label' | 'outline' | 'text';
export type ButtonSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3',
  md: 'min-h-11 px-4',
  lg: 'min-h-12 px-6',
};

const textSizeClasses: Record<ButtonSize, string> = {
  sm: 'text-13',
  md: 'text-15',
  lg: 'text-18',
};

const iconGapClasses: Record<ButtonSize, string> = {
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-2.5',
};

export type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  className?: string;
};

type ToneStyleSet = {
  default: string;
  defaultState: string;
  label: string;
  labelState: string;
  outline: string;
  text: string;
  subtleState: string;
  defaultText: string;
};

const toneStyles: Record<ButtonTone, ToneStyleSet> = {
  primary: {
    default: 'bg-light-palette-primary-main',
    defaultState: 'hover:bg-light-palette-primary-dark active:bg-light-palette-primary-dark focus:bg-light-palette-primary-dark',
    label: 'bg-light-palette-primary-opacity-light',
    labelState: 'hover:bg-light-palette-primary-opacity-main active:bg-light-palette-primary-opacity-main focus:bg-light-palette-primary-opacity-main',
    outline: 'border-light-palette-primary-main',
    text: 'text-light-palette-primary-main',
    subtleState: 'hover:bg-light-palette-primary-opacity-lighter active:bg-light-palette-primary-opacity-lighter focus:bg-light-palette-primary-opacity-lighter',
    defaultText: 'text-light-misc-bg-white',
  },
  secondary: {
    default: 'bg-light-palette-secondary-main',
    defaultState: 'hover:bg-light-palette-secondary-dark active:bg-light-palette-secondary-dark focus:bg-light-palette-secondary-dark',
    label: 'bg-light-palette-secondary-opacity-light',
    labelState: 'hover:bg-light-palette-secondary-opacity-main active:bg-light-palette-secondary-opacity-main focus:bg-light-palette-secondary-opacity-main',
    outline: 'border-light-palette-secondary-main',
    text: 'text-light-palette-secondary-main',
    subtleState: 'hover:bg-light-palette-secondary-opacity-lighter active:bg-light-palette-secondary-opacity-lighter focus:bg-light-palette-secondary-opacity-lighter',
    defaultText: 'text-light-misc-bg-white',
  },
  error: {
    default: 'bg-light-palette-error-main',
    defaultState: 'hover:bg-light-palette-error-dark active:bg-light-palette-error-dark focus:bg-light-palette-error-dark',
    label: 'bg-light-palette-error-opacity-light',
    labelState: 'hover:bg-light-palette-error-opacity-main active:bg-light-palette-error-opacity-main focus:bg-light-palette-error-opacity-main',
    outline: 'border-light-palette-error-main',
    text: 'text-light-palette-error-main',
    subtleState: 'hover:bg-light-palette-error-opacity-lighter active:bg-light-palette-error-opacity-lighter focus:bg-light-palette-error-opacity-lighter',
    defaultText: 'text-light-misc-bg-white',
  },
  warning: {
    default: 'bg-light-palette-warning-main',
    defaultState: 'hover:bg-light-palette-warning-dark active:bg-light-palette-warning-dark focus:bg-light-palette-warning-dark',
    label: 'bg-light-palette-warning-opacity-light',
    labelState: 'hover:bg-light-palette-warning-opacity-main active:bg-light-palette-warning-opacity-main focus:bg-light-palette-warning-opacity-main',
    outline: 'border-light-palette-warning-main',
    text: 'text-light-palette-warning-main',
    subtleState: 'hover:bg-light-palette-warning-opacity-lighter active:bg-light-palette-warning-opacity-lighter focus:bg-light-palette-warning-opacity-lighter',
    defaultText: 'text-light-misc-bg-white',
  },
  info: {
    default: 'bg-light-palette-info-main',
    defaultState: 'hover:bg-light-palette-info-dark active:bg-light-palette-info-dark focus:bg-light-palette-info-dark',
    label: 'bg-light-palette-info-opacity-light',
    labelState: 'hover:bg-light-palette-info-opacity-main active:bg-light-palette-info-opacity-main focus:bg-light-palette-info-opacity-main',
    outline: 'border-light-palette-info-main',
    text: 'text-light-palette-info-main',
    subtleState: 'hover:bg-light-palette-info-opacity-lighter active:bg-light-palette-info-opacity-lighter focus:bg-light-palette-info-opacity-lighter',
    defaultText: 'text-light-misc-bg-white',
  },
  success: {
    default: 'bg-light-palette-success-main',
    defaultState: 'hover:bg-light-palette-success-dark active:bg-light-palette-success-dark focus:bg-light-palette-success-dark',
    label: 'bg-light-palette-success-opacity-light',
    labelState: 'hover:bg-light-palette-success-opacity-main active:bg-light-palette-success-opacity-main focus:bg-light-palette-success-opacity-main',
    outline: 'border-light-palette-success-main',
    text: 'text-light-palette-success-main',
    subtleState: 'hover:bg-light-palette-success-opacity-lighter active:bg-light-palette-success-opacity-lighter focus:bg-light-palette-success-opacity-lighter',
    defaultText: 'text-light-misc-bg-white',
  },
};

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
