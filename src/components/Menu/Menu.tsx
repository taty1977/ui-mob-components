import { useRef, useState, type ReactElement, type ReactNode } from 'react';
import { Modal, Pressable, Text, useWindowDimensions, View } from 'react-native';

import { Icon, type IconName } from '../Icon';

// --- Types -----------------------------------------------------------------------

export type MenuItem = {
  label: string;
  /** Registry icon name shown before the label. */
  icon?: IconName;
  /** Error tone for destructive actions. */
  destructive?: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

/** Window-px offset for the card; right-aligned when left is omitted. */
export type MenuPosition = { top: number; right?: number; left?: number };

export type MenuViewProps = {
  items: MenuItem[];
  open: boolean;
  /** Fired by backdrop press, item selection, and Android back. */
  onClose: () => void;
  position?: MenuPosition;
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
  className,
}: MenuViewProps): ReactElement {
  return (
    <Modal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      {/* Full-screen backdrop closes the menu on press. */}
      <Pressable accessibilityLabel="Close menu" className="flex-1" onPress={onClose}>
        {/* The card swallows presses so tapping its padding doesn't close the menu. */}
        <Pressable
          accessibilityRole="menu"
          onPress={() => {}}
          className={[
            'absolute min-w-44 rounded-lg border border-outline-border bg-misc-paper py-1 shadow-lg',
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
            <Pressable
              key={item.label}
              accessibilityRole="menuitem"
              disabled={item.disabled}
              onPress={() => {
                item.onPress?.();
                onClose();
              }}
              className={[
                'flex-row items-center gap-3 px-4 py-2.5 text-text-primary',
                item.disabled ? 'opacity-40' : undefined,
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {item.icon ? (
                <Icon name={item.icon} size="sm" tone={item.destructive ? 'error' : 'inherit'} />
              ) : null}
              <Text
                className={
                  item.destructive
                    ? 'text-15 text-palette-error-main'
                    : 'text-15 text-text-primary'
                }
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// --- Component ---------------------------------------------------------------------

/** Dropdown menu. Pass a trigger node (uncontrolled, card anchors below the
 * trigger) or drive open/onClose yourself (controlled, e.g. from Header's
 * onPressMenu button). */
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
      setMeasured({ top: y + height + 4, right: Math.max(windowWidth - x - width, 8) })
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
