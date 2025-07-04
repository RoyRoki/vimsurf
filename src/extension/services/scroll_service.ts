// Service for scrolling 

let scrollAmount: AppUnits = AppUnits.scrollAmount

export function initScrollService() {
  // Load user setting
  chrome.storage.sync.get("scrollAmount", data => {
    if (typeof data.scrollAmount === "number") {
      scrollAmount = data.scrollAmount;
    }
  });
}

export function getScrollAmount(): number {
  return scrollAmount;
}

export function validateScrolleAmount(amount: number): boolean {
  const isValid = -9999 < amount && amount < 9999;
  return isValid;
}
