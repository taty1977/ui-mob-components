import { Pressable, Text, type PressableProps } from 'react-native';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3',
  md: 'min-h-11 px-4',
  lg: 'min-h-12 px-6',
};

const textSizeClasses: Record<ButtonSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export type ButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  ...props
}: ButtonProps) {


  const variantClasses: Record<ButtonVariant, string> = {
    primary: 'bg-light-brand-primary active:bg-light-brand-600 dark:bg-dark-brand-primary dark:active:bg-dark-brand-600',
    secondary: 'bg-light-background-surface active:bg-light-action-hover dark:bg-dark-background-surface dark:active:bg-dark-action-hover',
    outline: 'border border-light-border-subtle bg-transparent active:bg-light-action-hover dark:border-dark-border-subtle dark:active:bg-dark-action-hover',
    ghost: 'bg-transparent active:bg-light-action-hover dark:active:bg-dark-action-hover',
  };

  const textClasses: Record<ButtonVariant, string> = {
    primary: 'text-light-text-primary dark:text-dark-text-primary',
    secondary: 'text-light-text-primary dark:text-dark-text-primary',
    outline: 'text-light-text-primary dark:text-dark-text-primary',
    ghost: 'text-light-text-primary dark:text-dark-text-primary',
  };

  const classes = [
    'items-center justify-center rounded-md',
    variantClasses[variant],
    sizeClasses[size],
    disabled && 'opacity-50',
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
      <Text className={['font-semibold', textClasses[variant], textSizeClasses[size]].join(' ')}>
        {label}
      </Text>
    </Pressable>
  );
}
