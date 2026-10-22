import { useRef, useState, type ReactElement, type ReactNode } from 'react';
import { Modal, Pressable, useWindowDimensions, View } from 'react-native';

import type { NavigationTone } from '../../themes/paletteTones';
import { NavItemRow, type NavItem } from '../NavItem';

/** Brand tone for item hover; Menu offers primary and secondary only. */
export type MenuTone = NavigationTone;

// --- Types -----------------------------------------------------------------------

export type MenuItem = NavItem;

/** Window-px offset for the card; right-aligned when left is omitted. */
export type MenuPosition = { top: number; right?: number; left?: number };

export type MenuViewProps = {
  items: MenuItem[];
  open: boolean;
  /** Fired by backdrop press, item selection, and Android back. */
  onClose: () => void;
  position?: MenuPosition;
  /** Theme tone (primary | secondary) for item hover, focus, and press; destructive items always use error. */
  tone?: MenuTone;
  className?: string;
};

export type MenuProps = Omit<MenuViewProps, 'open' | 'onClose'> & {
  /** Anchor node (non-pressable — Menu wraps it in its own Pressable). */
  trigger?: ReactNode;
  /** Controlled open state; omit to let the trigger drive it. */
  open?: boolean;
  /** Notified when the menu closes (backdrop, item selection, Android back). */
  onClose?: () => void;
};

// --- View ---------------------------------------------------------------------------

/** Stateless dropdown card in a transparent Modal; exported so unit tests can
 * drive every state. */
export function MenuView({
  items,
  open,
  onClose,
  position,
  tone = 'primary',
  className,
}: MenuViewProps): ReactElement {
  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1">
        {/* Backdrop is a sibling so card presses can't bubble into it (web). */}
        <Pressable accessibilityLabel="Close menu" className="absolute inset-0" onPress={onClose} />
        <View
          accessibilityRole="menu"
          className={[
            'absolute min-w-44 rounded-lg border border-border-subtle bg-background-surface py-1 shadow-lg',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          style={{
            top: position?.top ?? 0,
            ...(position?.left !== undefined
              ? { left: position.left }
              : { right: position?.right ?? 8 }),
          }}
        >
          {items.map((item) => (
            <NavItemRow key={item.label} item={item} tone={tone} size="sm" onSelect={onClose} />
          ))}
        </View>
      </View>
    </Modal>
  );
}

// --- Component ---------------------------------------------------------------------

/** Dropdown menu. Pass a trigger node (uncontrolled, card anchors below the
 * trigger) or drive open/onClose yourself (controlled). */
export function Menu({
  trigger,
  open: controlledOpen,
  onClose,
  position,
  ...viewProps
}: MenuProps): ReactElement {
  const [internalOpen, setInternalOpen] = useState(false);
  const [measured, setMeasured] = useState<MenuPosition>({ top: 0, right: 8 });
  const anchorRef = useRef<View>(null);
  const windowWidth = useWindowDimensions().width;

  const openMenu = () => {
    // Align the card's right edge with the trigger's, just below it.
    anchorRef.current?.measureInWindow((x, y, width, height) =>
      setMeasured({
        top: y + height + 4,
        right: Math.max(windowWidth - x - width, 8),
      }),
    );
    setInternalOpen(true);
  };

  // Controlled or not, closing also notifies the parent.
  const close = () => {
    setInternalOpen(false);
    onClose?.();
  };

  return (
    <>
      {trigger ? (
        // collapsable=false keeps the view measurable on native.
        <View ref={anchorRef} collapsable={false}>
          <Pressable accessibilityRole="button" accessibilityLabel="Open menu" onPress={openMenu}>
            {trigger}
          </Pressable>
        </View>
      ) : null}
      <MenuView
        {...viewProps}
        open={controlledOpen ?? internalOpen}
        onClose={close}
        position={position ?? measured}
      />
    </>
  );
}
