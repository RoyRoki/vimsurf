import { PluginActionMap } from "extension/interfaces/named_action_mapsI";
import { getScrollAmount, validateScrollAmount } from "extension/services/scroll_service";
import { moveFocus } from "extension/services/spatial_nav_service";

export const scrollActions: PluginActionMap = {
  scroll: ({ amount }: { amount?: number }) => {
    if (amount !== undefined && !validateScrollAmount(amount)) return;
    const delta = amount ?? getScrollAmount();
    window.scrollBy(0, delta);
  },
  jumpTop: () => window.scrollTo(0, 0),
  jumpBottom: () => window.scrollTo(0, document.body.scrollHeight),

  // New movement commands
  moveUp: () => moveFocus("up"),
  moveDown: () => moveFocus("down"),
  moveLeft: () => moveFocus("left"),
  moveRight: () => moveFocus("right"),
  moveZTop: () => moveFocus("ztop"),
  moveZDown: () => moveFocus("zdown"),
};
