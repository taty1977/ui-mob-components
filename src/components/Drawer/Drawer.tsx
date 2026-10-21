import { useEffect, useRef, useState, type ReactElement, type ReactNode } from 'react';
import {
  Animated,
  Easing,
  Modal,
  Platform,
  Pressable,
  useWindowDimensions,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { IconButton } from '../IconButton';
import { Logo } from '../Logo';

const IS_WEB = Platform.OS === 'web';

// Plain View on web (CSS transition); Animated.View on native (slideStyle).
const Panel = (IS_WEB ? View : Animated.View) as typeof View;

export type DrawerSide = 'left' | 'right';

export type DrawerViewProps = {
  open: boolean;
  /** Visual in/out state; drives the slide transition on web. */
  shown?: boolean;
  /** Fired by backdrop press and Android back. */
  onClose: () => void;
  /** Screen edge the panel sits on; measured from the trigger when unset. */
  side?: DrawerSide;
  /** Panel width in px. */
  width?: number;
  /** Animated slide transform from the wrapper; the panel is static when omitted. */
  slideStyle?: StyleProp<ViewStyle>;
  children?: ReactNode;
  className?: string;
};

export type DrawerProps = Omit<DrawerViewProps, 'open' | 'onClose'> & {
  /** Anchor node (non-pressable — Drawer wraps it in its own Pressable). */
  trigger?: ReactNode;
  /** Controlled open state; omit to let the trigger drive it. */
  open?: boolean;
  /** Notified when the drawer closes (backdrop, Android back). */
  onClose?: () => void;
};

/** Stateless slide-in panel in a transparent Modal; exported so unit tests can
 * drive every state. */
export function DrawerView({
  open,
  shown,
  onClose,
  side = 'left',
  width = 280,
  slideStyle,
  children,
  className,
}: DrawerViewProps): ReactElement {
  // RNW's Modal renders inline, so on web pin the overlay to the viewport.
  const position = IS_WEB ? 'fixed' : 'absolute';
  const webSlide = IS_WEB
    ? `transition-transform duration-250 ${
        shown ? 'translate-x-0' : side === 'left' ? '-translate-x-full' : 'translate-x-full'
      }`
    : undefined;
  const webFade = IS_WEB
    ? `transition-opacity duration-250 ${shown ? 'opacity-100' : 'opacity-0'}`
    : undefined;

  return (
    <Modal visible={open} transparent animationType="none" onRequestClose={onClose}>
      <View className="flex-1">
        {/* Sibling backdrop: panel presses must not bubble into it (web). */}
        <Pressable
          accessibilityLabel="Close drawer"
          className={[`${position} inset-0`, webFade].filter(Boolean).join(' ')}
          onPress={onClose}
        />
        <Panel
          className={[
            position,
            'top-0 bottom-0 bg-background-surface shadow-lg',
            side === 'left' ? 'left-0' : 'right-0',
            webSlide,
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          style={[{ width }, slideStyle]}
        >
          <View className="flex-row items-center justify-between px-4 py-2">
            <Logo variant="icon" size={20} />
            <IconButton
              name={side === 'left' ? 'chevron-left' : 'chevron-right'}
              size="md"
              tone="primary"
              accessibilityLabel="Close drawer"
              onPress={onClose}
            />
          </View>
          {children}
        </Panel>
      </View>
    </Modal>
  );
}

/** Side drawer. Pass a trigger node (uncontrolled) or drive open/onClose
 * yourself (controlled). */
export function Drawer({
  trigger,
  open: controlledOpen,
  side: controlledSide,
  onClose,
  ...viewProps
}: DrawerProps): ReactElement {
  const [internalOpen, setInternalOpen] = useState(false);
  const [measuredSide, setMeasuredSide] = useState<DrawerSide>('left');
  const [mounted, setMounted] = useState(controlledOpen ?? false);
  const [shown, setShown] = useState(controlledOpen ?? false);
  const anchorRef = useRef<View>(null);
  const slide = useRef(new Animated.Value(controlledOpen ? 0 : 1)).current;
  const windowWidth = useWindowDimensions().width;

  const open = controlledOpen ?? internalOpen;
  const side = controlledSide ?? measuredSide;
  const width = viewProps.width ?? 280;

  // Open from the trigger's side of the window when side isn't set.
  const openDrawer = () => {
    anchorRef.current?.measureInWindow((x, _y, width) =>
      setMeasuredSide(x + width / 2 > windowWidth / 2 ? 'right' : 'left'),
    );
    setInternalOpen(true);
  };

  // Controlled or not, closing also notifies the parent.
  const close = () => {
    setInternalOpen(false);
    onClose?.();
  };

  // Slide the panel in/out; the Modal stays mounted until the exit transition ends.
  useEffect(() => {
    if (open) {
      setMounted(true);
      if (IS_WEB) {
        // Next frame: the out-state must paint before the in-class applies.
        const frame = requestAnimationFrame(() => setShown(true));
        return () => cancelAnimationFrame(frame);
      }
      const enter = Animated.timing(slide, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      });
      enter.start();
      return () => enter.stop();
    }
    if (IS_WEB) {
      setShown(false);
      const timeout = setTimeout(() => setMounted(false), 250);
      return () => clearTimeout(timeout);
    }
    const exit = Animated.timing(slide, {
      toValue: 1,
      duration: 250,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    });
    exit.start(() => setMounted(false));
    return () => exit.stop();
  }, [open, slide]);

  const offscreen = side === 'left' ? -width : width;
  // Native only — on web an inline transform would override the CSS classes.
  const slideStyle = IS_WEB
    ? undefined
    : {
        transform: [{ translateX: slide.interpolate({ inputRange: [0, 1], outputRange: [0, offscreen] }) }],
      };

  return (
    <>
      {trigger ? (
        // collapsable=false keeps the view measurable on native.
        <View ref={anchorRef} collapsable={false}>
          <Pressable accessibilityRole="button" accessibilityLabel="Open drawer" onPress={openDrawer}>
            {trigger}
          </Pressable>
        </View>
      ) : null}
      <DrawerView
        {...viewProps}
        width={width}
        side={side}
        slideStyle={slideStyle}
        shown={shown}
        open={mounted}
        onClose={close}
      />
    </>
  );
}
