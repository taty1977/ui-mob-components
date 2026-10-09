// Shared text style maps for Heading and Typography.

export type TextTone =
  | 'default'
  | 'muted'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'warning'
  | 'info'
  | 'success'
  | 'inverse';

export const textToneClasses: Record<TextTone, string> = {
  default: 'text-text-primary',
  muted: 'text-text-secondary',
  primary: 'text-palette-primary-main',
  secondary: 'text-palette-secondary-main',
  error: 'text-palette-error-main',
  warning: 'text-palette-warning-main',
  info: 'text-palette-info-main',
  success: 'text-palette-success-main',
  inverse: 'text-misc-bg-white',
};

export type TextWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export const textWeightClasses: Record<TextWeight, string> = {
  regular: 'font-regular',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};
