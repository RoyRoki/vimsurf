import { Modes } from "extension/constants/modes";

let currentMode: string = Modes.Normal;

export function initModeService() {
  document.addEventListener('keydown', e => {
    const el = e.target as HTMLElement;

    if (e.key === 'Escape') {
      setCurrentMode(Modes.Normal);
      return;
    }

    if (currentMode === Modes.Insert) return;

    if (currentMode === Modes.Normal) {
      if (e.key === 'i') {
        setCurrentMode(Modes.Insert);
        return;
      }

      if (e.key === 'v') {
        setCurrentMode(Modes.Visual);
        return;
      }

      if (el.matches('input, textarea, [contenteditable]')) {
        e.preventDefault();
        el.blur(); // Fix: blur input in normal mode
      }

      if (e.key === 'y' || e.key === 'p') {
        e.preventDefault();
        copyOrPaste(e.key);
        return;
      }
    }

    if (currentMode === Modes.Visual) {
      if (e.key === 'y') {
        e.preventDefault();
        copyOrPaste('y');
        return;
      }

      if (el.matches('input, textarea, [contenteditable]')) {
        e.preventDefault();
        el.blur();
      }
    }
  });

  document.addEventListener('focusin', e => {
    const el = e.target as Element;
    if (el.matches('input, textarea, [contenteditable]')) {
      setCurrentMode(Modes.Insert);
    }
  });
}

function copyOrPaste(key: string) {
  const evt = new CustomEvent('vimsurf:manualAction', {
    detail: { key }
  });
  document.dispatchEvent(evt);
}

export function getCurrentMode(): string {
  return currentMode;
}

export function setCurrentMode(mode: string) {
  if (currentMode === mode) return;
  currentMode = mode;

  if (mode === Modes.Normal || mode === Modes.Visual) {
    const active = document.activeElement as HTMLElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
      active.blur();
    }
  }

  document.documentElement.setAttribute('data-vimsurf-mode', mode);
  document.dispatchEvent(new CustomEvent('vimsurf:modeChanged', { detail: { mode } }));
  console.log(`[Vimsurf] Switched to mode: ${mode}`);
}
