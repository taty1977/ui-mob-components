import type { PaletteTone } from '../../themes/paletteTones';

export type ButtonTone = PaletteTone;
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
