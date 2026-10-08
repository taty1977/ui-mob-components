import { useState, type ReactElement, type ReactNode, type Ref } from 'react';
import { Platform, Text, TextInput, View, type LayoutChangeEvent, type TextInputProps } from 'react-native';
import { isKeyboardModality } from '../../utils/focusModality';
import { LabelText } from './LabelText';
import {
  borderWidthClasses,
  fieldFrame,
  fieldGap,
  HORIZONTAL_PADDING,
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
  /** Keyboard (Tab) focus only; pointer/touch focus leaves this false. */
  focusVisible?: boolean;
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
  focusVisible = false,
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
  const labelPlacement: InFieldLabelPlacement | 'above' | undefined =
    !label || (!filled && Boolean(placeholder))
      ? undefined
      : filled
        ? shrunkPlacement[variant]
        : 'unshrunk';
  const notchLabel = labelPlacement === 'notch';

  // --- Colors ---
  const toneStyle = toneClasses[disabled ? 'disabled' : error ? 'error' : tone];

  const borderTone =
    error && !disabled ? toneStyle.border : focusVisible ? toneStyle.strongBorder : toneStyle.border;
  const labelTone = disabled || error || focused ? toneStyle.text : 'text-text-secondary';
  const helperTone = disabled || error ? toneStyle.text : 'text-text-secondary';

  const iconTone = disabled ? toneStyle.text : 'text-text-secondary';

  // --- Field frame ---
  const notchGap = notchLabel && notchWidth != null;

  const borderWidth = borderWidthClasses[variant][focused ? 'focus' : 'rest'];
  const notchPieceWidth = notchPieceWidthClasses[focused ? 'focus' : 'rest'];

  const paddingLeft =
    variant === 'standard' && !iconLeft
      ? undefined
      : iconLeft
        ? paddingLeftClasses[size].withIcon
        : paddingLeftClasses[size].plain;
  const paddingRight =
    variant === 'standard' && !iconRight
      ? undefined
      : iconRight
        ? paddingRightClasses[size].withIcon
        : paddingRightClasses[size].plain;

  const fieldClasses = [
    'flex-row items-center',
    fieldGap[size],
    notchGap ? 'group relative bg-background-surface' : variantBase[variant],
    fieldFrame[variant][size],
    paddingLeft,
    paddingRight,
    notchGap ? undefined : borderWidth,
    notchGap ? undefined : borderTone,
    iconTone,
    !notchGap && !disabled && !error ? toneStyle.hoverBorder : undefined,
    variant === 'filled' && !disabled && !error ? 'hover:bg-action-selected' : undefined,
    notchLabel ? 'mt-2' : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  const pieceClasses = (extra: string) =>
    [
      extra,
      borderTone,
      !disabled && !error ? toneStyle.groupHoverBorder : undefined,
    ]
      .filter(Boolean)
      .join(' ');

  // --- Label offsets ---
  const padPx = HORIZONTAL_PADDING[size];
  const labelEdgePadding = variant === 'standard' ? 0 : padPx.plain;
  const leftPaddingPx =
    variant === 'standard' && !iconLeft ? 0 : iconLeft ? padPx.withIcon : padPx.plain;
  const rightPaddingPx =
    variant === 'standard' && !iconRight ? 0 : iconRight ? padPx.withIcon : padPx.plain;
  const unshrunkLeft = leftPaddingPx + (iconLeft ? (size === 'small' ? 28 : 34) : 0);

  // --- Input ---
  const filledInputPadding = label ? 'pt-5' : 'py-1';

  const inputClasses = [
    'flex-1 bg-transparent outline-none',
    inputTextSize[size],
    variant === 'filled' ? filledInputPadding : undefined,
    disabled ? 'text-text-disabled' : 'text-text-primary',
    inputClassName,
  ]
    .filter(Boolean)
    .join(' ');

  // Web-only: RN has no "invalid" a11y state.
  const invalidProps =
    Platform.OS === 'web' && error ? ({ 'aria-invalid': true } as const) : undefined;

  // --- In-field label config ---
  const inFieldLabel =
    label &&
    (labelPlacement === 'notch' ||
      labelPlacement === 'filledTop' ||
      labelPlacement === 'unshrunk')
      ? {
          notch: {
            wrapperClass: [
              inFieldLabelWrapper.notch,
              notchGap ? undefined : 'bg-background-surface',
            ]
              .filter(Boolean)
              .join(' '),
            style: undefined,
            textSize: 'text-13 px-1',
            onLayout: onNotchLabelLayout,
          },
          filledTop: {
            wrapperClass: inFieldLabelWrapper.filledTop,
            style: { left: labelEdgePadding, right: labelEdgePadding },
            textSize: 'text-13',
            onLayout: undefined,
          },
          unshrunk: {
            wrapperClass: inFieldLabelWrapper.unshrunk,
            style: { left: unshrunkLeft, right: rightPaddingPx },
            textSize: inputTextSize[size],
            onLayout: undefined,
          },
        }[labelPlacement]
      : undefined;

  return (
    <View className={className}>
      {label && labelPlacement === 'above' ? (
        <LabelText
          text={label}
          required={required}
          className={['mb-1 text-13', labelTone].join(' ')}
        />
      ) : null}
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
              className={[inFieldLabel.textSize, labelTone].join(' ')}
            />
          </View>
        ) : null}
        {iconLeft}
        <TextInput
          accessibilityLabel={accessibilityLabel ?? label}
          className={inputClasses}
          placeholder={placeholder}
          placeholderClassName="text-text-disabled"
          {...props}
          {...invalidProps}
          editable={!disabled}
          ref={ref}
        />
        {iconRight}
      </View>
      {helperText ? (
        <Text className={['mt-1 text-13', helperTone].join(' ')}>{helperText}</Text>
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
  const [focusVisible, setFocusVisible] = useState(false);
  const [notchWidth, setNotchWidth] = useState<number>();
  const [text, setText] = useState(defaultValue ?? '');

  const filled = (value ?? text).length > 0;

  return (
    <InputView
      {...props}
      defaultValue={defaultValue}
      value={value}
      focused={focused}
      focusVisible={focusVisible}
      filled={filled}
      notchWidth={notchWidth}
      onNotchLabelLayout={(event) => setNotchWidth(event.nativeEvent.layout.width)}
      onBlur={(event) => {
        setFocused(false);
        setFocusVisible(false);
        onBlur?.(event);
      }}
      onChangeText={(next) => {
        setText(next);
        onChangeText?.(next);
      }}
      onFocus={(event) => {
        setFocused(true);
        setFocusVisible(isKeyboardModality());
        onFocus?.(event);
      }}
    />
  );
}
