import { getScrollAmount, validateScrolleAmount } from "extension/services/scroll_service"

export const scrollActions = {
  scroll: ({ amount }: { amount?: number }) => {
    if (amount != undefined && !validateScrolleAmount(amount)) {
      return;
    }
    const delta = amount ?? getScrollAmount();
    window.scrollBy(0, delta);
  },
  jumpTop: () => window.scrollTo(0, 0),
  jumpBottom: () => window.scrollTo(0, document.body.scrollHeight)
};
