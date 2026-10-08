import { useRef, useState, type ReactElement, type ReactNode } from 'react';
import { Animated, Easing, LayoutAnimation, Platform, Pressable, Text, View, type PressableProps } from 'react-native';

// --- Types -----------------------------------------------------------------------

export type StepperTone = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';

export type StepperStep = {
  title: string;
  description?: string;
  /** Custom node shown instead of the step number (completed steps still show completedIcon). */
  icon?: ReactNode;
  content?: ReactNode;
};

export type StepperProps = {
  steps: StepperStep[];
  /** Controlled active index; omit for uncontrolled. */
  activeStep?: number;
  /** Initial index when uncontrolled. */
  defaultStep?: number;
  onStepPress?: (index: number) => void;
  /** Accent color for active and completed steps. */
  tone?: StepperTone;
  /** Custom node shown on completed steps (e.g., your icon set); defaults to a check text. */
  completedIcon?: ReactNode;
  className?: string;
};

export type StepperViewProps = StepperProps & {
  activeIndex: number;
  onSelect: (index: number) => void;
};

// --- Tone styles ------------------------------------------------------------------
// Active/completed steps carry the tone; inactive steps stay neutral.
const toneClasses: Record<StepperTone, { bg: string; text: string }> = {
  primary: { bg: 'bg-palette-primary-main', text: 'text-palette-primary-main' },
  secondary: { bg: 'bg-palette-secondary-main', text: 'text-palette-secondary-main' },
  error: { bg: 'bg-palette-error-main', text: 'text-palette-error-main' },
  warning: { bg: 'bg-palette-warning-main', text: 'text-palette-warning-main' },
  info: { bg: 'bg-palette-info-main', text: 'text-palette-info-main' },
  success: { bg: 'bg-palette-success-main', text: 'text-palette-success-main' },
};

const INACTIVE_BG = 'bg-action-disabled';

// Shared style for the default number / check glyphs.
const CIRCLE_TEXT_CLASS = 'text-13 font-semibold text-misc-bg-white';

// --- Step circle -------------------------------------------------------------------

type StepCircleProps = Pick<
  PressableProps,
  'accessibilityRole' | 'accessibilityState' | 'accessibilityLabel'
> & {
  className: string;
  /** Tone color class for the pulse halo. */
  haloClassName: string;
  index: number;
  onSelect: (index: number) => void;
  children: ReactNode;
};

/** Circle indicator with a pulse-shadow halo on press. */
function StepCircle({
  className,
  haloClassName,
  index,
  onSelect,
  children,
  ...a11y
}: StepCircleProps): ReactElement {
  // Idle at 1: the interpolation ends at opacity 0, so the halo is invisible at rest.
  const pulse = useRef(new Animated.Value(1)).current;

  const firePulse = () => {
    pulse.setValue(0);
    Animated.timing(pulse, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.ease),
      // RN-web has no native driver for this.
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  };

  return (
    <Pressable {...a11y} onPress={() => onSelect(index)} onPressIn={firePulse}>
      {/* The halo renders first so the circle paints over its center. */}
      <View className="relative">
        <Animated.View
          pointerEvents="none"
          className={['absolute inset-0 rounded-full', haloClassName].join(' ')}
          style={{
            opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0] }),
            transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.9] }) }],
          }}
        />
        <View className={className}>{children}</View>
      </View>
    </Pressable>
  );
}

// --- View ---------------------------------------------------------------------------

/** Stateless renderer for Stepper; exported so unit tests can drive every state. */
export function StepperView({
  steps,
  tone = 'primary',
  completedIcon,
  className,
  activeIndex,
  onSelect,
}: StepperViewProps): ReactElement {
  const toneStyle = toneClasses[tone];

  return (
    <View className={['p-4', className].filter(Boolean).join(' ')}>
      {steps.map((step, index) => {
        const isCompleted = index < activeIndex;
        const isActive = index === activeIndex;
        const isLast = index === steps.length - 1;

        const circleBg = isCompleted || isActive ? toneStyle.bg : INACTIVE_BG;
        const lineClass = isCompleted ? toneStyle.bg : INACTIVE_BG;
        const titleClass = isActive
          ? toneStyle.text
          : isCompleted
            ? 'text-text-primary'
            : 'text-text-secondary';
        // Content priority: completed icon > step icon > step number.
        const circleContent = isCompleted
          ? (completedIcon ?? <Text className={CIRCLE_TEXT_CLASS}>✓</Text>)
          : (step.icon ?? <Text className={CIRCLE_TEXT_CLASS}>{index + 1}</Text>);

        return (
          <View key={index} className="flex-row">
            <View className="items-center mr-3">
              <StepCircle
                className={['w-8 h-8 rounded-full items-center justify-center z-10', circleBg].join(' ')}
                haloClassName={circleBg}
                index={index}
                onSelect={onSelect}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
                accessibilityLabel={`Step ${index + 1}: ${step.title}`}
              >
                {circleContent}
              </StepCircle>
              {!isLast ? (
                <View className={['w-0.5 flex-1 min-h-8 my-1', lineClass].join(' ')} />
              ) : null}
            </View>
            <View className="flex-1 pb-6">
              {/* Without a description the title centers against the 32px circle. */}
              <Pressable
                accessibilityRole="button"
                onPress={() => onSelect(index)}
                className={step.description ? undefined : 'min-h-8 justify-center'}
              >
                <Text className={['text-15 font-semibold', titleClass].join(' ')}>{step.title}</Text>
                {step.description ? (
                  <Text className="text-13 text-text-secondary mt-0.5">{step.description}</Text>
                ) : null}
              </Pressable>
              {isActive && step.content ? <View className="mt-3">{step.content}</View> : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}

// --- Component ---------------------------------------------------------------------

/** Vertical stepper with collapsible step content. Controlled via activeStep
 * or uncontrolled with internal state; LayoutAnimation animates the content
 * on native (no-op on web). */
export function Stepper({
  steps,
  activeStep,
  defaultStep = 0,
  onStepPress,
  ...props
}: StepperProps): ReactElement {
  const [internalStep, setInternalStep] = useState(defaultStep);
  const activeIndex = activeStep ?? internalStep;

  const handleSelect = (index: number) => {
    if (Platform.OS !== 'web') {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    // No state update when controlled — the parent drives activeStep.
    if (activeStep === undefined) setInternalStep(index);
    onStepPress?.(index);
  };

  return <StepperView {...props} steps={steps} activeIndex={activeIndex} onSelect={handleSelect} />;
}
