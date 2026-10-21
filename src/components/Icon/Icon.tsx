import type { ReactElement, ReactNode } from 'react';
import Svg, { Path, type SvgProps } from 'react-native-svg';
import { a11yProps } from '../../utils/a11yProps';
import { iconPaths, type IconName } from './paths';

export type IconSize = 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
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

export const iconSizeValues: Record<IconSize, number> = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 40,
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
  /** Custom SVG content rendered instead of the built-in registry path. */
  children?: ReactNode;
};

/** Registry icon from paths.ts. Decorative (hidden from assistive technology)
 * unless accessibilityLabel makes it meaningful. */
export function Icon({
  name,
  size = 'md',
  tone = 'inherit',
  className,
  accessibilityLabel,
  children,
}: IconProps): ReactElement<SvgProps> {
  const dimension = iconSizeValues[size];
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
      {...a11yProps(decorative, accessibilityLabel)}
    >
      {children ?? <Path d={iconPaths[name]} />}
    </Svg>
  );
}
