import { useState, type ReactElement, type ReactNode, type Ref } from 'react';
import { Platform, Text, TextInput, View, type LayoutChangeEvent, type TextInputProps } from 'react-native';
import { LabelText } from './LabelText';
import {
  borderWidthClasses,
  fieldFrame,
  fieldGap,
  HORIZONTAL_PADDING,
  inFieldLabelText,
  inFieldLabelWrapper,
  inputTextSize,
  NOTCH_LABEL_LEFT,
  notchPieceWidthClasses,
  paddingLeftClasses,
  paddingRightClasses,
  shrunkPlacement,
  toneClasses,
  variantBase,
  type InFieldLabelPlacement,
  type InputSize,
  type InputTone,
  type InputVariant,
} from './input.styles';

export { LabelText } from './LabelText';
export type { InputSize, InputTone, InputVariant } from './input.styles';

export type InputProps = TextInputProps & {
  label?: string;
  helperText?: string;
  error?: boolean;
  variant?: InputVariant;
  size?: InputSize;
  /** Accent color for border and focused label (MUI's `color` prop). Error overrides it. */
  tone?: InputTone;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  /** Extra NativeWind classes applied to the TextInput itself. */
  inputClassName?: string;
  /** Ref to the underlying TextInput (React 19 ref-as-prop). */
  ref?: Ref<TextInput>;
};

export type InputViewProps = InputProps & {
  focused: boolean;
  filled?: boolean;
  /** Until measured, the label covers the border with a surface bg. */
  notchWidth?: number;
  onNotchLabelLayout?: (event: LayoutChangeEvent) => void;
};

/** Stateless renderer for Input; exported so unit tests can drive every visual state. */
export function InputView({
  label,
  helperText,
  error = false,
  variant = 'outlined',
  size = 'normal',
  tone = 'primary',
  iconLeft,
  iconRight,
  required = false,
  disabled = false,
  focused,
  filled = false,
  notchWidth,
  onNotchLabelLayout,
  className,
  inputClassName,
  placeholder,
  accessibilityLabel,
  ref,
  ...props
}: InputViewProps): ReactElement {
  // --- Label placement ---
  const labelPlacement: InFieldLabelPlacement | undefined =
    !label || (!filled && Boolean(placeholder))
      ? undefined
      : filled
        ? shrunkPlacement[variant]
        : 'unshrunk';
  const notchLabel = labelPlacement === 'notch';
  // Outlined and standard labels straddle the top edge, so the field drops by their overhang.
  const overhangingLabel = notchLabel || labelPlacement === 'standardTop';

  // --- Colors ---
  const toneStyle = toneClasses[disabled ? 'disabled' : error ? 'error' : tone];

  const borderTone = toneStyle.border;
  const labelTone = disabled || error || focused ? toneStyle.text : 'text-text-secondary';
  const helperTone = disabled || error ? toneStyle.text : 'text-text-secondary';

  const iconTone = disabled ? toneStyle.text : 'text-text-secondary';

  // --- Field frame ---
  const notchGap = notchLabel && notchWidth != null;

  const borderWidth = borderWidthClasses[variant][focused ? 'focus' : 'rest'];
  const notchPieceWidth = notchPieceWidthClasses[focused ? 'focus' : 'rest'];

  const paddingLeft = iconLeft
    ? paddingLeftClasses[size].withIcon
    : paddingLeftClasses[size].plain;
  const paddingRight = iconRight
    ? paddingRightClasses[size].withIcon
    : paddingRightClasses[size].plain;

  const fieldClasses = [
    'flex-row items-center font-sans transition-colors',
    fieldGap[size],
    notchGap ? 'group relative bg-background-surface' : variantBase[variant],
    fieldFrame[variant][size],
    paddingLeft,
    paddingRight,
    notchGap ? undefined : borderWidth,
    notchGap ? undefined : borderTone,
    iconTone,
    !notchGap && !disabled && !error
      ? focused
        ? borderTone
        : toneStyle.hoverBorder
      : undefined,
    overhangingLabel ? 'mt-2' : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  const pieceClasses = (extra: string) =>
    [
      extra,
      borderTone,
      !disabled && !error && !focused ? toneStyle.groupHoverBorder : undefined,
    ]
      .filter(Boolean)
      .join(' ');

  // --- Label offsets ---
  const padPx = HORIZONTAL_PADDING[size];
  const leftPaddingPx = iconLeft ? padPx.withIcon : padPx.plain;
  const rightPaddingPx = iconRight ? padPx.withIcon : padPx.plain;
  const unshrunkLeft = leftPaddingPx + (iconLeft ? (size === 'small' ? 28 : 30) : 0);

  // --- Input ---
  // Like the web field: text stays centered until a filled-variant label shrinks to the top,
  // then the input stretches and drops below it (18px top padding).
  const shrunkFilledLabel = variant === 'filled' && labelPlacement === 'filledTop';

  const inputClasses = [
    'flex-1 bg-transparent font-sans leading-5 outline-none',
    inputTextSize[size],
    shrunkFilledLabel ? 'self-stretch pb-0 pt-[18px]' : 'py-0',
    disabled ? 'text-text-disabled' : 'text-text-primary',
    inputClassName,
  ]
    .filter(Boolean)
    .join(' ');

  // Web-only: RN has no "invalid" a11y state.
  const invalidProps =
    Platform.OS === 'web' && error ? ({ 'aria-invalid': true } as const) : undefined;

  // --- In-field label config ---
  const inFieldLabel = labelPlacement
    ? {
        wrapperClass: [
          inFieldLabelWrapper[labelPlacement],
          notchLabel && !notchGap ? 'bg-background-surface' : undefined,
        ]
          .filter(Boolean)
          .join(' '),
        style:
          labelPlacement === 'unshrunk' ? { left: unshrunkLeft, right: rightPaddingPx } : undefined,
        textClass: inFieldLabelText[labelPlacement],
        onLayout: notchLabel ? onNotchLabelLayout : undefined,
      }
    : undefined;

  return (
    <View className={className}>
      <View className={fieldClasses}>
        {notchGap ? (
          <>
            <View
              pointerEvents="none"
              className={pieceClasses(
                `absolute bottom-0 left-0 top-0 w-3 rounded-l-md ${notchPieceWidth.left}`
              )}
            />
            <View
              pointerEvents="none"
              className={pieceClasses(`absolute bottom-0 left-3 right-3 ${notchPieceWidth.bottom}`)}
            />
            <View
              pointerEvents="none"
              style={{ left: NOTCH_LABEL_LEFT + (notchWidth ?? 0) }}
              className={pieceClasses(
                `absolute bottom-0 right-0 top-0 rounded-r-md ${notchPieceWidth.right}`
              )}
            />
          </>
        ) : null}
        {label && inFieldLabel ? (
          <View
            pointerEvents="none"
            onLayout={inFieldLabel.onLayout}
            className={inFieldLabel.wrapperClass}
            style={inFieldLabel.style}
          >
            <LabelText
              text={label}
              required={required}
              className={[inFieldLabel.textClass, labelTone].join(' ')}
            />
          </View>
        ) : null}
        {iconLeft}
        <TextInput
          accessibilityLabel={accessibilityLabel ?? label}
          className={inputClasses}
          placeholder={placeholder}
          placeholderClassName="text-text-secondary"
          // Android otherwise adds font padding and top-aligns text in a stretched input.
          textAlignVertical="center"
          {...props}
          {...invalidProps}
          editable={!disabled}
          ref={ref}
        />
        {iconRight}
      </View>
      {helperText ? (
        <Text className={['mt-1 font-sans text-13', helperTone].join(' ')}>{helperText}</Text>
      ) : null}
    </View>
  );
}

/** MUI-style text field; every TextInput prop passes straight through. */
export function Input({
  defaultValue,
  onBlur,
  onChangeText,
  onFocus,
  value,
  ...props
}: InputProps): ReactElement {
  const [focused, setFocused] = useState(false);
  const [notchWidth, setNotchWidth] = useState<number>();
  const [text, setText] = useState(defaultValue ?? '');

  const filled = (value ?? text).length > 0;

  return (
    <InputView
      {...props}
      defaultValue={defaultValue}
      value={value}
      focused={focused}
      filled={filled}
      notchWidth={notchWidth}
      onNotchLabelLayout={(event) => setNotchWidth(event.nativeEvent.layout.width)}
      onBlur={(event) => {
        setFocused(false);
        onBlur?.(event);
      }}
      onChangeText={(next) => {
        setText(next);
        onChangeText?.(next);
      }}
      onFocus={(event) => {
        setFocused(true);
        onFocus?.(event);
      }}
    />
  );
}
