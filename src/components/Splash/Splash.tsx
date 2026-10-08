import { useEffect, useRef, type ReactElement } from 'react';
import {
  Animated,
  Easing,
  Platform,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { themeTokens } from '../../themes/themeTokens';
import { Logo } from '../Logo';

export type SplashProps = {
  /** Loading message below the spinner; omit to hide it. */
  message?: string;
  /** Spinner dimensions in px (square); the logo renders at half that. */
  size?: number;
  className?: string;
};

export type SplashViewProps = SplashProps & {
  /** Halo pulse style, driven by Splash's animation loop. */
  haloStyle?: StyleProp<ViewStyle>;
};

// Halo color from the palette: soft primary fill.
const HALO = themeTokens.core.color.palette['primary-opacity-light'];

/** Stateless renderer for Splash; exported so unit tests can drive it directly. */
export function SplashView({
  message,
  size = 144,
  className,
  haloStyle,
}: SplashViewProps): ReactElement {
  const markSize = Math.round(size / 2);

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={message ?? 'Loading'}
      className={['items-center justify-center gap-4', className].filter(Boolean).join(' ')}
    >
      <View className="items-center justify-center" style={{ width: size, height: size }}>
        <Animated.View style={[{ position: 'absolute', width: size, height: size }, haloStyle]}>
          <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
            <Circle cx={50} cy={50} r={46} fill={HALO} />
          </Svg>
        </Animated.View>
        {/* z-10 keeps the logo above the absolutely-positioned ring. */}
        <View className="z-10">
          <Logo variant="stacked" size={markSize} />
        </View>
      </View>
      {message ? <Text className="text-13 font-semibold text-text-secondary">{message}</Text> : null}
    </View>
  );
}

/** Loading indicator: a soft halo pulsing behind the logo. */
export function Splash(props: SplashProps): ReactElement {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: 1200,
        easing: Easing.out(Easing.ease),
        // RN-web has no native driver for this.
        useNativeDriver: Platform.OS !== 'web',
      })
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const haloStyle = {
    opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.7, 0] }),
    transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1.5] }) }],
  };

  return <SplashView {...props} haloStyle={haloStyle} />;
}
