import { Platform } from 'react-native';

/** Decorative/labeled a11y props for Svg/View: aria-* on web (RN props leak to the DOM), RN props on native. */
export const a11yProps = (decorative: boolean, label?: string) =>
  Platform.OS === 'web'
    ? ({
        'aria-hidden': decorative || undefined,
        role: decorative ? undefined : 'img',
        'aria-label': label,
      } as const)
    : ({
        accessible: !decorative,
        accessibilityElementsHidden: decorative,
        importantForAccessibility: decorative ? 'no-hide-descendants' : 'auto',
        accessibilityLabel: label,
        accessibilityRole: decorative ? 'none' : 'image',
      } as const);
