export type ButtonTone = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
export type ButtonVariant = 'default' | 'label' | 'outline' | 'text';
export type ButtonSize = 'sm' | 'md' | 'lg';

// Button frames: 36px (sm), 44px (md), 48px (lg).
export const sizeClasses: Record<ButtonSize, string> = {
  sm: 'min-h-9 px-3',
  md: 'min-h-11 px-4',
  lg: 'min-h-12 px-6',
};

export const textSizeClasses: Record<ButtonSize, string> = {
  sm: 'text-13',
  md: 'text-15',
  lg: 'text-18',
};

export const iconGapClasses: Record<ButtonSize, string> = {
  sm: 'gap-1.5',
  md: 'gap-2',
  lg: 'gap-2.5',
};

export type ToneStyleSet = {
  default: string;
  defaultState: string;
  label: string;
  labelState: string;
  outline: string;
  text: string;
  subtleState: string;
  defaultText: string;
};

// Tone style matrix; interaction states ride the NativeWind hover/active/focus classes.
export const toneStyles: Record<ButtonTone, ToneStyleSet> = {
  primary: {
    default: 'bg-palette-primary-main',
    defaultState: 'hover:bg-palette-primary-dark active:bg-palette-primary-dark focus:bg-palette-primary-dark',
    label: 'bg-palette-primary-opacity-light',
    labelState: 'hover:bg-palette-primary-opacity-main active:bg-palette-primary-opacity-main focus:bg-palette-primary-opacity-main',
    outline: 'border-palette-primary-main',
    text: 'text-palette-primary-main',
    subtleState: 'hover:bg-palette-primary-opacity-lighter active:bg-palette-primary-opacity-lighter focus:bg-palette-primary-opacity-lighter',
    defaultText: 'text-misc-bg-white',
  },
  secondary: {
    default: 'bg-palette-secondary-main',
    defaultState: 'hover:bg-palette-secondary-dark active:bg-palette-secondary-dark focus:bg-palette-secondary-dark',
    label: 'bg-palette-secondary-opacity-light',
    labelState: 'hover:bg-palette-secondary-opacity-main active:bg-palette-secondary-opacity-main focus:bg-palette-secondary-opacity-main',
    outline: 'border-palette-secondary-main',
    text: 'text-palette-secondary-main',
    subtleState: 'hover:bg-palette-secondary-opacity-lighter active:bg-palette-secondary-opacity-lighter focus:bg-palette-secondary-opacity-lighter',
    defaultText: 'text-misc-bg-white',
  },
  error: {
    default: 'bg-palette-error-main',
    defaultState: 'hover:bg-palette-error-dark active:bg-palette-error-dark focus:bg-palette-error-dark',
    label: 'bg-palette-error-opacity-light',
    labelState: 'hover:bg-palette-error-opacity-main active:bg-palette-error-opacity-main focus:bg-palette-error-opacity-main',
    outline: 'border-palette-error-main',
    text: 'text-palette-error-main',
    subtleState: 'hover:bg-palette-error-opacity-lighter active:bg-palette-error-opacity-lighter focus:bg-palette-error-opacity-lighter',
    defaultText: 'text-misc-bg-white',
  },
  warning: {
    default: 'bg-palette-warning-main',
    defaultState: 'hover:bg-palette-warning-dark active:bg-palette-warning-dark focus:bg-palette-warning-dark',
    label: 'bg-palette-warning-opacity-light',
    labelState: 'hover:bg-palette-warning-opacity-main active:bg-palette-warning-opacity-main focus:bg-palette-warning-opacity-main',
    outline: 'border-palette-warning-main',
    text: 'text-palette-warning-main',
    subtleState: 'hover:bg-palette-warning-opacity-lighter active:bg-palette-warning-opacity-lighter focus:bg-palette-warning-opacity-lighter',
    defaultText: 'text-misc-bg-white',
  },
  info: {
    default: 'bg-palette-info-main',
    defaultState: 'hover:bg-palette-info-dark active:bg-palette-info-dark focus:bg-palette-info-dark',
    label: 'bg-palette-info-opacity-light',
    labelState: 'hover:bg-palette-info-opacity-main active:bg-palette-info-opacity-main focus:bg-palette-info-opacity-main',
    outline: 'border-palette-info-main',
    text: 'text-palette-info-main',
    subtleState: 'hover:bg-palette-info-opacity-lighter active:bg-palette-info-opacity-lighter focus:bg-palette-info-opacity-lighter',
    defaultText: 'text-misc-bg-white',
  },
  success: {
    default: 'bg-palette-success-main',
    defaultState: 'hover:bg-palette-success-dark active:bg-palette-success-dark focus:bg-palette-success-dark',
    label: 'bg-palette-success-opacity-light',
    labelState: 'hover:bg-palette-success-opacity-main active:bg-palette-success-opacity-main focus:bg-palette-success-opacity-main',
    outline: 'border-palette-success-main',
    text: 'text-palette-success-main',
    subtleState: 'hover:bg-palette-success-opacity-lighter active:bg-palette-success-opacity-lighter focus:bg-palette-success-opacity-lighter',
    defaultText: 'text-misc-bg-white',
  },
};
