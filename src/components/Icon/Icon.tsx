import type { ReactElement, ReactNode } from 'react';
import Svg, { Path, type SvgProps } from 'react-native-svg';
import { iconPaths, type IconName } from './paths';

export type IconSize = 'sm' | 'md' | 'lg';
export type IconTone =
  | 'inherit'
  | 'primary'
  | 'secondary'
  | 'error'
  | 'warning'
  | 'info'
  | 'success'
  | 'muted'
  | 'inverse';

const sizeValues: Record<IconSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
};

const toneClasses: Record<Exclude<IconTone, 'inherit'>, string> = {
  primary: 'text-light-palette-primary-main',
  secondary: 'text-light-palette-secondary-main',
  error: 'text-light-palette-error-main',
  warning: 'text-light-palette-warning-main',
  info: 'text-light-palette-info-main',
  success: 'text-light-palette-success-main',
  muted: 'text-light-text-secondary',
  inverse: 'text-light-misc-bg-white',
};

export type IconProps = {
  name: IconName;
  size?: IconSize;
  tone?: IconTone;
  className?: string;
  accessibilityLabel?: string;
  children?: ReactNode;
};

export function Icon({
  name,
  size = 'md',
  tone = 'inherit',
  className,
  accessibilityLabel,
}: IconProps): ReactElement<SvgProps> {
  const dimension = sizeValues[size];
  const colorClass = tone === 'inherit' ? undefined : toneClasses[tone];
  const classes = [colorClass, className].filter(Boolean).join(' ');

  return (
    <Svg
      width={dimension}
      height={dimension}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={classes || undefined}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="image"
    >
      <Path d={iconPaths[name]} />
    </Svg>
  );
}
