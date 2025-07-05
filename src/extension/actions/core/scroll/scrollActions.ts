import { PluginActionMap } from "extension/interfaces/named_action_mapsI";
import { getScrollAmount, validateScrollAmount } from "extension/services/scroll_service";

export const scrollActions: PluginActionMap = {
  scroll: ({ amount }: { amount?: number }) => {
    if (amount !== undefined && !validateScrollAmount(amount)) {
      return;
    }
    const delta = amount ?? getScrollAmount();
    window.scrollBy(0, delta);
  },
  jumpTop: (): void => {
    window.scrollTo(0, 0);
  },
  jumpBottom: (): void => {
    window.scrollTo(0, document.body.scrollHeight);
  },
};

export default function getCoreActions(): PluginActionMap {
  return scrollActions;
}

