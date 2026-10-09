import type { ReactElement, ReactNode } from 'react';
import { Text } from 'react-native';

import {
  textToneClasses,
  textWeightClasses,
  type TextTone,
  type TextWeight,
} from '../../utils/text.styles';

// --- Types -----------------------------------------------------------------------

export type BodyTextVariant =
  | 'subtitle1'
  | 'subtitle2'
  | 'body1'
  | 'body2'
  | 'caption'
  | 'overline';

export type BodyTextTone = TextTone;
export type BodyTextWeight = TextWeight;

export type BodyTextProps = {
  /** MUI-style variant; sets size and default weight. */
  variant?: BodyTextVariant;
  /** Text color from the theme. */
  tone?: BodyTextTone;
  /** Overrides the variant's default weight. */
  weight?: BodyTextWeight;
  numberOfLines?: number;
  children: ReactNode;
  className?: string;
};

// --- Style maps ---------------------------------------------------------------------

// Token font-size per variant: 18/15/15/13/12/12.
const sizeClasses: Record<BodyTextVariant, string> = {
  subtitle1: 'text-18',
  subtitle2: 'text-15',
  body1: 'text-15',
  body2: 'text-13',
  caption: 'text-12',
  overline: 'text-12',
};

const defaultWeights: Record<BodyTextVariant, BodyTextWeight> = {
  subtitle1: 'medium',
  subtitle2: 'medium',
  body1: 'regular',
  body2: 'regular',
  caption: 'regular',
  overline: 'medium',
};

// --- Component ---------------------------------------------------------------------

/** Body-scale text with MUI-style variants; font-sans follows the active theme.
 * For h1–h6 use Heading. */
export function BodyText({
  variant = 'body1',
  tone = 'default',
  weight,
  numberOfLines,
  children,
  className,
}: BodyTextProps): ReactElement {
  return (
    <Text
      numberOfLines={numberOfLines}
      className={[
        'font-sans',
        sizeClasses[variant],
        textWeightClasses[weight ?? defaultWeights[variant]],
        variant === 'overline' ? 'uppercase tracking-wider' : undefined,
        textToneClasses[tone],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Text>
  );
}
