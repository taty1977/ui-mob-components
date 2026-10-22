/** Theme palette tones shared by every toned component (Button, Menu, Input, Stepper, Footer). */
export type PaletteTone = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

export const paletteTones: readonly PaletteTone[] = [
  'primary',
  'secondary',
  'error',
  'warning',
  'info',
  'success',
];

/** Brand tones offered by navigation surfaces (Menu, Drawer). */
export type NavigationTone = Extract<PaletteTone, 'primary' | 'secondary'>;

export const navigationTones: readonly NavigationTone[] = ['primary', 'secondary'];

export type PaletteToneStyles = {
  default: string;
  defaultState: string;
  label: string;
  labelState: string;
  outline: string;
  text: string;
  subtleState: string;
  /** 16% tint on hover/focus, 24% on press � list rows such as Menu items. */
  tintState: string;
  /** Main tone text on parent hover/focus; parent needs the `group` class. */
  groupHoverText: string;
  defaultText: string;
};

// Per-tone theme classes; interaction states ride NativeWind hover/active/focus variants.
export const paletteToneStyles: Record<PaletteTone, PaletteToneStyles> = {
  primary: {
    default: 'bg-palette-primary-main',
    defaultState:
      'hover:bg-palette-primary-dark active:bg-palette-primary-dark focus:bg-palette-primary-dark',
    label: 'bg-palette-primary-opacity-light',
    labelState:
      'hover:bg-palette-primary-opacity-main active:bg-palette-primary-opacity-main focus:bg-palette-primary-opacity-main',
    outline: 'border-palette-primary-main',
    text: 'text-palette-primary-main',
    subtleState:
      'hover:bg-palette-primary-opacity-lighter active:bg-palette-primary-opacity-lighter focus:bg-palette-primary-opacity-lighter',
    tintState:
      'hover:bg-palette-primary-opacity-light focus:bg-palette-primary-opacity-light active:bg-palette-primary-opacity-main',
    groupHoverText: 'group-hover:text-palette-primary-main group-focus:text-palette-primary-main',
    defaultText: 'text-misc-bg-white',
  },
  secondary: {
    default: 'bg-palette-secondary-main',
    defaultState:
      'hover:bg-palette-secondary-dark active:bg-palette-secondary-dark focus:bg-palette-secondary-dark',
    label: 'bg-palette-secondary-opacity-light',
    labelState:
      'hover:bg-palette-secondary-opacity-main active:bg-palette-secondary-opacity-main focus:bg-palette-secondary-opacity-main',
    outline: 'border-palette-secondary-main',
    text: 'text-palette-secondary-main',
    subtleState:
      'hover:bg-palette-secondary-opacity-lighter active:bg-palette-secondary-opacity-lighter focus:bg-palette-secondary-opacity-lighter',
    tintState:
      'hover:bg-palette-secondary-opacity-light focus:bg-palette-secondary-opacity-light active:bg-palette-secondary-opacity-main',
    groupHoverText:
      'group-hover:text-palette-secondary-main group-focus:text-palette-secondary-main',
    defaultText: 'text-misc-bg-white',
  },
  error: {
    default: 'bg-palette-error-main',
    defaultState:
      'hover:bg-palette-error-dark active:bg-palette-error-dark focus:bg-palette-error-dark',
    label: 'bg-palette-error-opacity-light',
    labelState:
      'hover:bg-palette-error-opacity-main active:bg-palette-error-opacity-main focus:bg-palette-error-opacity-main',
    outline: 'border-palette-error-main',
    text: 'text-palette-error-main',
    subtleState:
      'hover:bg-palette-error-opacity-lighter active:bg-palette-error-opacity-lighter focus:bg-palette-error-opacity-lighter',
    tintState:
      'hover:bg-palette-error-opacity-light focus:bg-palette-error-opacity-light active:bg-palette-error-opacity-main',
    groupHoverText: 'group-hover:text-palette-error-main group-focus:text-palette-error-main',
    defaultText: 'text-misc-bg-white',
  },
  warning: {
    default: 'bg-palette-warning-main',
    defaultState:
      'hover:bg-palette-warning-dark active:bg-palette-warning-dark focus:bg-palette-warning-dark',
    label: 'bg-palette-warning-opacity-light',
    labelState:
      'hover:bg-palette-warning-opacity-main active:bg-palette-warning-opacity-main focus:bg-palette-warning-opacity-main',
    outline: 'border-palette-warning-main',
    text: 'text-palette-warning-main',
    subtleState:
      'hover:bg-palette-warning-opacity-lighter active:bg-palette-warning-opacity-lighter focus:bg-palette-warning-opacity-lighter',
    tintState:
      'hover:bg-palette-warning-opacity-light focus:bg-palette-warning-opacity-light active:bg-palette-warning-opacity-main',
    groupHoverText: 'group-hover:text-palette-warning-main group-focus:text-palette-warning-main',
    defaultText: 'text-misc-bg-white',
  },
  info: {
    default: 'bg-palette-info-main',
    defaultState:
      'hover:bg-palette-info-dark active:bg-palette-info-dark focus:bg-palette-info-dark',
    label: 'bg-palette-info-opacity-light',
    labelState:
      'hover:bg-palette-info-opacity-main active:bg-palette-info-opacity-main focus:bg-palette-info-opacity-main',
    outline: 'border-palette-info-main',
    text: 'text-palette-info-main',
    subtleState:
      'hover:bg-palette-info-opacity-lighter active:bg-palette-info-opacity-lighter focus:bg-palette-info-opacity-lighter',
    tintState:
      'hover:bg-palette-info-opacity-light focus:bg-palette-info-opacity-light active:bg-palette-info-opacity-main',
    groupHoverText: 'group-hover:text-palette-info-main group-focus:text-palette-info-main',
    defaultText: 'text-misc-bg-white',
  },
  success: {
    default: 'bg-palette-success-main',
    defaultState:
      'hover:bg-palette-success-dark active:bg-palette-success-dark focus:bg-palette-success-dark',
    label: 'bg-palette-success-opacity-light',
    labelState:
      'hover:bg-palette-success-opacity-main active:bg-palette-success-opacity-main focus:bg-palette-success-opacity-main',
    outline: 'border-palette-success-main',
    text: 'text-palette-success-main',
    subtleState:
      'hover:bg-palette-success-opacity-lighter active:bg-palette-success-opacity-lighter focus:bg-palette-success-opacity-lighter',
    tintState:
      'hover:bg-palette-success-opacity-light focus:bg-palette-success-opacity-light active:bg-palette-success-opacity-main',
    groupHoverText: 'group-hover:text-palette-success-main group-focus:text-palette-success-main',
    defaultText: 'text-misc-bg-white',
  },
};
