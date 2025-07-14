import { appDom } from "extension/bootstraps/app_dom";
import { getCurrentMode } from "./mode_switching_service";
import { updateVisualSelection } from "./visual_clipboard_service";

let focusIndex = 0;
let navigable: HTMLElement[] = [];

export function initSpatialNavService() {
  collectNavigableElements();

  const observer = new MutationObserver(() => {
    collectNavigableElements();
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

function collectNavigableElements() {
  const all = appDom.queryAll<HTMLElement>("*[tabindex], button, a, input, textarea, [data-navigable]");
  navigable = all.filter(el => {
    const rect = el.getBoundingClientRect();
    return rect.width > 5 && rect.height > 5 && el.offsetParent !== null;
  });

  // Ensure focusIndex is valid
  focusIndex = Math.min(focusIndex, navigable.length - 1);

  navigable.forEach(el => el.classList.remove("vimsurf-highlight"));
  if (navigable[focusIndex]) {
    navigable[focusIndex].classList.add("vimsurf-highlight");
    navigable[focusIndex].scrollIntoView({ block: "center", behavior: "smooth" });
  }
}

export function moveFocus(direction: "up" | "down" | "left" | "right" | "ztop" | "zdown") {
  if (!navigable.length) return;

  const current = navigable[focusIndex];
  if (!current) return;

  const currentRect = current.getBoundingClientRect();
  let bestIndex = focusIndex;
  let minDist = Infinity;

  // Special handling for ztop/zdown
  if (direction === "ztop" || direction === "zdown") {
    const sorted = [...navigable].sort((a, b) => {
      const za = parseInt(getComputedStyle(a).zIndex || "0", 10);
      const zb = parseInt(getComputedStyle(b).zIndex || "0", 10);
      return direction === "ztop" ? zb - za : za - zb;
    });

    const currentInSorted = sorted.indexOf(current);
    const nextInSorted = direction === "ztop" ? currentInSorted + 1 : currentInSorted - 1;

    if (nextInSorted >= 0 && nextInSorted < sorted.length) {
      bestIndex = navigable.indexOf(sorted[nextInSorted]);
    }
  } else {
    // Positional navigation
    navigable.forEach((el, idx) => {
      if (idx === focusIndex) return;

      const rect = el.getBoundingClientRect();
      const dx = rect.left - currentRect.left;
      const dy = rect.top - currentRect.top;

      let match = false;
      switch (direction) {
        case "up": match = dy < 0 && Math.abs(dx) < rect.width; break;
        case "down": match = dy > 0 && Math.abs(dx) < rect.width; break;
        case "left": match = dx < 0 && Math.abs(dy) < rect.height; break;
        case "right": match = dx > 0 && Math.abs(dy) < rect.height; break;
      }

      if (!match) return;

      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < minDist) {
        bestIndex = idx;
        minDist = dist;
      }
    });
  }

  if (bestIndex !== focusIndex && navigable[bestIndex]) {
    navigable[focusIndex].classList.remove("vimsurf-highlight");
    focusIndex = bestIndex;
    navigable[focusIndex].classList.add("vimsurf-highlight");
    navigable[focusIndex].focus({ preventScroll: true });
    navigable[focusIndex].scrollIntoView({ block: "center", behavior: "smooth" });

    if (getCurrentMode() === "visual") {
      updateVisualSelection();
    }
  }
}
