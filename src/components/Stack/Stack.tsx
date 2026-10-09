import type { ReactElement, ReactNode } from 'react';
import { View } from 'react-native';

// --- Types -----------------------------------------------------------------------

/** row = horizontal stack; column (default) = vertical. */
export type StackDirection = 'column' | 'row';

/** Cross-axis alignment; stretch (default) matches RN. */
export type StackAlign = 'start' | 'center' | 'end' | 'stretch';

/** Main-axis distribution; start (default) matches RN. */
export type StackJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

/** Spacing between children, on the token gap scale. */
export type StackGap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8;

export type StackProps = {
  /** Stack direction; column is RN's default. */
  direction?: StackDirection;
  /** Gap between children on the token spacing scale. */
  gap?: StackGap;
  /** Cross-axis alignment. */
  align?: StackAlign;
  /** Main-axis distribution. */
  justify?: StackJustify;
  /** Let children wrap onto multiple lines. */
  wrap?: boolean;
  /** Grow to fill the parent (flex-1). */
  flex?: boolean;
  children?: ReactNode;
  className?: string;
};

// --- Style maps ---------------------------------------------------------------------

// Static class lists: Tailwind/NativeWind only generate classes they can see in
// source, so gap/align/justify can't be interpolated.
const alignClasses: Record<StackAlign, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const justifyClasses: Record<StackJustify, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

const gapClasses: Record<StackGap, string> = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
};

// --- Component ---------------------------------------------------------------------

/** Layout primitive: stacks children vertically (default) or horizontally with a
 * token-scaled gap, alignment, and distribution. Classes matching RN's defaults
 * (column / stretch / start) are omitted. */
export function Stack({
  direction = 'column',
  gap,
  align = 'stretch',
  justify = 'start',
  wrap = false,
  flex = false,
  children,
  className,
}: StackProps): ReactElement {
  return (
    <View
      // Prop-driven classes first, consumer className last so it wins conflicts.
      className={[
        direction === 'row' ? 'flex-row' : undefined,
        align !== 'stretch' ? alignClasses[align] : undefined,
        justify !== 'start' ? justifyClasses[justify] : undefined,
        gap !== undefined ? gapClasses[gap] : undefined,
        wrap ? 'flex-wrap' : undefined,
        flex ? 'flex-1' : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </View>
  );
}
