// Service for modes switching

let currentMode: Modes = Modes.Normal

export function initModeService() {
  // track focus‐in / out for insert vs normal mode
  document.addEventListener('focusin', e => {
    const el = e.target as Element;
    currentMode = el.matches('input, textarea, [contenteditable]')
      ? Modes.Insert
      : Modes.Normal;
  });
}

// Getter helpers
export function getCurrentMode(): Modes {
  return currentMode;
}

// Setter helpers
export function setCurrentMode(mode: Modes) {
  if (currentMode === mode) {
    return;
  }
  currentMode = mode;
}

