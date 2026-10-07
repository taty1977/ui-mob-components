import type { ReactElement } from 'react';
import { Text, type LayoutChangeEvent } from 'react-native';

/** Label text with the required asterisk, shared by all label positions. */
export function LabelText({
  text,
  required,
  className,
  onLayout,
}: {
  text: string;
  required: boolean;
  className: string;
  onLayout?: (event: LayoutChangeEvent) => void;
}): ReactElement {
  return (
    <Text className={className} onLayout={onLayout}>
      {text}
      {required ? <Text className="text-palette-error-main"> *</Text> : null}
    </Text>
  );
}
