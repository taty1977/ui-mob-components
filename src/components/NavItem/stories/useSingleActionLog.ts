import { useRef } from 'react';

import type { NavItem } from '../NavItem';

/** Story helper: selecting an item closes Menu/Drawer too, which would log two
 * actions per click. Logs onClose only for dismissals (backdrop, close button,
 * Android back) so each interaction counts once in the Actions panel. */
export function useSingleActionLog(
  items: NavItem[] | undefined,
  onClose: (() => void) | undefined,
): { items: NavItem[] | undefined; onClose: () => void } {
  const selecting = useRef(false);

  return {
    items: items?.map((item) => ({
      ...item,
      onPress: () => {
        selecting.current = true;
        item.onPress?.();
      },
    })),
    onClose: () => {
      if (!selecting.current) onClose?.();
      selecting.current = false;
    },
  };
}
