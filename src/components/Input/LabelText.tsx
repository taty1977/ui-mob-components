import type { ReactElement } from 'react';
import { Text, type LayoutChangeEvent } from 'react-native';

export type LabelTextProps = {
  text: string;
  required: boolean;
  className: string;
  onLayout?: (event: LayoutChangeEvent) => void;
};

/** Label text with the required asterisk, shared by all label positions. */
export function LabelText({
  text,
  required,
  className,
  onLayout,
}: LabelTextProps): ReactElement {
  return (
    <Text className={className} onLayout={onLayout}>
      {text}
      {required ? <Text className="text-palette-error-main"> *</Text> : null}
    </Text>
  );
}
