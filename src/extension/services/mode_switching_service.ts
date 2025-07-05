// Service for modes switching

import { Modes } from "extension/constants/modes";

let currentMode: string = Modes.Normal;

export function initModeService() {
  // track focus‐in / out for insert vs normal mode
  document.addEventListener('focusin', e => {
    const el = e.target as Element;
    currentMode = el.matches('input, textarea, [contenteditable]')
      ? Modes.Insert
      : Modes.Normal
  });
}

// Getter helpers
export function getCurrentMode(): string {
  return currentMode;
}

// Setter helpers
export function setCurrentMode(mode: string) {
  if (currentMode === mode) {
    return;
  }
  currentMode = mode;
  document.dispatchEvent(new CustomEvent('vimsurf:modeChanged', {
    detail: { mode: mode }
  }));
}

