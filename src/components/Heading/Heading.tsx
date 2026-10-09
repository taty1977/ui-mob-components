import type { ReactElement, ReactNode } from 'react';
import { Platform, Text } from 'react-native';

import {
  textToneClasses,
  textWeightClasses,
  type TextTone,
  type TextWeight,
} from '../../utils/text.styles';

// --- Types -----------------------------------------------------------------------

export type HeadingVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type HeadingTone = TextTone;
export type HeadingWeight = TextWeight;

export type HeadingProps = {
  /** Semantic level; sets the token size and the web heading level. */
  variant?: HeadingVariant;
  /** Text color from the theme. */
  tone?: HeadingTone;
  /** Token font weight. */
  weight?: HeadingWeight;
  numberOfLines?: number;
  children: ReactNode;
  className?: string;
};

// --- Style maps ---------------------------------------------------------------------

// Token font-size per level: 46/38/28/24/18/15.
const sizeClasses: Record<HeadingVariant, string> = {
  h1: 'text-46',
  h2: 'text-38',
  h3: 'text-28',
  h4: 'text-24',
  h5: 'text-18',
  h6: 'text-15',
};

// --- Component ---------------------------------------------------------------------

/** Theme-aware heading: h1–h6 map to the token font sizes; font-sans resolves to
 * the active theme's family (Inter in light, Roboto in dark). */
export function Heading({
  variant = 'h4',
  tone = 'default',
  weight = 'bold',
  numberOfLines,
  children,
  className,
}: HeadingProps): ReactElement {
  return (
    <Text
      accessibilityRole="header"
      // Web needs an explicit level; native announces "header" via the role.
      {...(Platform.OS === 'web' ? { 'aria-level': Number(variant.slice(1)) } : {})}
      numberOfLines={numberOfLines}
      className={[
        'font-sans',
        sizeClasses[variant],
        textToneClasses[tone],
        textWeightClasses[weight],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Text>
  );
}
