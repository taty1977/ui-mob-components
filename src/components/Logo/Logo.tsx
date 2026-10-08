import type { ReactElement } from 'react';
import { Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { themeTokens } from '../../themes/themeTokens';

export type LogoVariant = 'horizontal' | 'stacked' | 'icon';

export type LogoProps = {
  /** `horizontal` = mark + wordmark side by side, `stacked` = mark above
   * centered wordmark, `icon` = mark only. */
  variant?: LogoVariant;
  /** Mark dimensions in px (square). */
  size?: number;
  className?: string;
  accessibilityLabel?: string;
};

// Brand colors come from the theme palette: primary-500 ring, success-500
// cross, onPrimary center dot.
const MARK_RING = themeTokens.core.color.primary[500];
const MARK_CROSS = themeTokens.core.color.success[500];
const MARK_DOT = themeTokens.semantic.color.text.onPrimary;

/** AllInOne Health logo. Mark and wordmark use theme palette colors. */
export function Logo({
  variant = 'horizontal',
  size = 40,
  className,
  accessibilityLabel,
}: LogoProps): ReactElement {
  // --- Mark ---

  // The wordmark announces the brand in text variants, so the mark is decorative there.
  const decorative = variant !== 'icon' || !accessibilityLabel;

  const mark = (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      accessible={!decorative}
      accessibilityElementsHidden={decorative}
      importantForAccessibility={decorative ? 'no-hide-descendants' : 'auto'}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole={decorative ? 'none' : 'image'}
    >
      <Circle
        cx={50}
        cy={50}
        r={40}
        stroke={MARK_RING}
        strokeWidth={8}
        strokeDasharray="180 35"
        strokeLinecap="round"
      />
      <Path d="M50 26V74M26 50H74" stroke={MARK_CROSS} strokeWidth={10} strokeLinecap="round" />
      <Circle cx={50} cy={50} r={4} fill={MARK_DOT} />
    </Svg>
  );

  if (variant === 'icon') return mark;

  // --- Wordmark layout ---

  const stacked = variant === 'stacked';
  // Stacked centers both text lines; horizontal stays left-aligned.
  const textClass = (base: string) =>
    [base, stacked ? 'text-center' : undefined].filter(Boolean).join(' ');

  return (
    <View
      className={[stacked ? 'items-center gap-1' : 'flex-row items-center gap-3', className]
        .filter(Boolean)
        .join(' ')}
    >
      {mark}
      <View className={stacked ? 'items-center' : undefined}>
        <Text
          numberOfLines={1}
          className={textClass('text-24 font-bold tracking-tight text-text-primary')}
        >
          {'AllInOne '}<Text style={{ color: MARK_RING }}>Health</Text>
        </Text>
        <Text className={textClass('text-12 font-medium uppercase tracking-wider text-text-secondary')}>
          Integrated Care System
        </Text>
      </View>
    </View>
  );
}
