export type InputVariant = 'outlined' | 'filled' | 'standard';
export type InputSize = 'small' | 'normal';
export type InputTone = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

// Field frames: small 44px, normal 48px.
export const fieldFrame: Record<InputVariant, Record<InputSize, string>> = {
  outlined: {
    small: 'min-h-11 py-2',
    normal: 'min-h-12 py-2',
  },
  filled: {
    small: 'min-h-11',
    normal: 'min-h-12',
  },
  standard: {
    small: 'min-h-11 py-1',
    normal: 'min-h-12 py-1',
  },
};

// An adornment takes 50% off the field padding on its own side.
export const HORIZONTAL_PADDING: Record<InputSize, { plain: number; withIcon: number }> = {
  small: { plain: 16, withIcon: 8 },
  normal: { plain: 24, withIcon: 12 },
};

export const paddingLeftClasses: Record<InputSize, { plain: string; withIcon: string }> = {
  small: { plain: 'pl-4', withIcon: 'pl-2' },
  normal: { plain: 'pl-6', withIcon: 'pl-3' },
};

export const paddingRightClasses: Record<InputSize, { plain: string; withIcon: string }> = {
  small: { plain: 'pr-4', withIcon: 'pr-2' },
  normal: { plain: 'pr-6', withIcon: 'pr-3' },
};

export const fieldGap: Record<InputSize, string> = {
  small: 'gap-2',
  normal: 'gap-2.5',
};

export const inputTextSize: Record<InputSize, string> = {
  small: 'text-15',
  normal: 'text-18',
};

export const variantBase: Record<InputVariant, string> = {
  outlined: 'relative rounded-md bg-background-surface',
  filled: 'relative rounded-t-md bg-action-hover',
  standard: 'relative bg-transparent',
};

export const borderWidthClasses: Record<InputVariant, { rest: string; focus: string }> = {
  outlined: { rest: 'border', focus: 'border-2' },
  filled: { rest: 'border-b', focus: 'border-b-2' },
  standard: { rest: 'border-b', focus: 'border-b-2' },
};

export const notchPieceWidthClasses: Record<
  'rest' | 'focus',
  { left: string; bottom: string; right: string }
> = {
  rest: {
    left: 'border-b border-l border-t',
    bottom: 'border-b',
    right: 'border-b border-r border-t',
  },
  focus: {
    left: 'border-b-2 border-l-2 border-t-2',
    bottom: 'border-b-2',
    right: 'border-b-2 border-r-2 border-t-2',
  },
};

// Resting borders carry the tone; hover and keyboard focus deepen it.
// 'disabled' is a pseudo-tone so every field state resolves through one map.
export type ToneClasses = {
  border: string;
  strongBorder: string;
  hoverBorder: string;
  groupHoverBorder: string;
  text: string;
};

export const toneClasses: Record<InputTone | 'disabled', ToneClasses> = {
  primary: {
    border: 'border-palette-primary-main',
    strongBorder: 'border-palette-primary-dark',
    hoverBorder: 'hover:border-palette-primary-dark',
    groupHoverBorder: 'group-hover:border-palette-primary-dark',
    text: 'text-palette-primary-main',
  },
  secondary: {
    border: 'border-palette-secondary-main',
    strongBorder: 'border-palette-secondary-dark',
    hoverBorder: 'hover:border-palette-secondary-dark',
    groupHoverBorder: 'group-hover:border-palette-secondary-dark',
    text: 'text-palette-secondary-main',
  },
  error: {
    border: 'border-palette-error-main',
    strongBorder: 'border-palette-error-dark',
    hoverBorder: 'hover:border-palette-error-dark',
    groupHoverBorder: 'group-hover:border-palette-error-dark',
    text: 'text-palette-error-main',
  },
  warning: {
    border: 'border-palette-warning-main',
    strongBorder: 'border-palette-warning-dark',
    hoverBorder: 'hover:border-palette-warning-dark',
    groupHoverBorder: 'group-hover:border-palette-warning-dark',
    text: 'text-palette-warning-main',
  },
  info: {
    border: 'border-palette-info-main',
    strongBorder: 'border-palette-info-dark',
    hoverBorder: 'hover:border-palette-info-dark',
    groupHoverBorder: 'group-hover:border-palette-info-dark',
    text: 'text-palette-info-main',
  },
  success: {
    border: 'border-palette-success-main',
    strongBorder: 'border-palette-success-dark',
    hoverBorder: 'hover:border-palette-success-dark',
    groupHoverBorder: 'group-hover:border-palette-success-dark',
    text: 'text-palette-success-main',
  },
  disabled: {
    border: 'border-text-disabled',
    strongBorder: 'border-text-disabled',
    hoverBorder: '',
    groupHoverBorder: '',
    text: 'text-text-disabled',
  },
};

/** Horizontal offset of the outlined notch label (left-3), in px. */
export const NOTCH_LABEL_LEFT = 12;

/** Where the label sits once the field has a value, per variant. */
export const shrunkPlacement = { outlined: 'notch', filled: 'filledTop', standard: 'above' } as const;

export type InFieldLabelPlacement = 'notch' | 'filledTop' | 'unshrunk';

export const inFieldLabelWrapper: Record<InFieldLabelPlacement, string> = {
  notch: 'absolute -top-2 left-3 z-10',
  filledTop: 'absolute top-1',
  unshrunk: 'absolute bottom-0 top-0 justify-center',
};
