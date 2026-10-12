import { Platform } from 'react-native';

/** var(--...) on web (follows the theme class), static fallback on native. */
export const themeColor = (cssVariable: string, fallback: string): string =>
  Platform.OS === 'web' ? `var(--${cssVariable})` : fallback;
