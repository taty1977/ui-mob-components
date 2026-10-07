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

// Theme-adaptive classes: resolve through per-theme CSS variables.
const toneClasses: Record<Exclude<IconTone, 'inherit'>, string> = {
  primary: 'text-palette-primary-main',
  secondary: 'text-palette-secondary-main',
  error: 'text-palette-error-main',
  warning: 'text-palette-warning-main',
  info: 'text-palette-info-main',
  success: 'text-palette-success-main',
  muted: 'text-text-secondary',
  inverse: 'text-misc-bg-white',
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
  // Without a label the icon is decorative: hide it from assistive technology
  // (also avoids the svg-img-alt violation an unnamed role=img would trigger).
  const decorative = !accessibilityLabel;

  return (
    <Svg
      width={dimension}
      height={dimension}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={classes || undefined}
      accessible={!decorative}
      accessibilityElementsHidden={decorative}
      importantForAccessibility={decorative ? 'no-hide-descendants' : 'auto'}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={decorative ? 'none' : 'image'}
    >
      <Path d={iconPaths[name]} />
    </Svg>
  );
}
