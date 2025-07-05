// Service for scrolling 
import { AppUnits } from "extension/constants/AppUnits";
import { LocalKeys } from "extension/constants/LocalKeys";

let scrollAmount: any = AppUnits.scrollAmount

export function initScrollService() {
  // Load user setting
  chrome.storage.sync.get(LocalKeys.scrollAmount, data => {
    if (typeof data.scrollAmount === "number" && validateScrollAmount(data.scrollAmount)) {
      scrollAmount = data.scrollAmount;
    }
  });
}

export function getScrollAmount(): number {
  return scrollAmount;
}

export function validateScrollAmount(amount: number): boolean {
  const isValid = -9999 < amount && amount < 9999;
  return isValid;
}
