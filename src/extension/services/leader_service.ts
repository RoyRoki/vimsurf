let isWaiting = false;
let timeoutId: number | null = null;

export function handleLeaderKey(char: string) {
  if (!isWaiting) return;

  switch (char) {
    case 'f': focusFirstInput(); break;
    case 'y': copyCurrentElement(); break;
    // more leader actions
  }

  isWaiting = false;
  if (timeoutId) clearTimeout(timeoutId);
}

export function triggerLeader() {
  isWaiting = true;
  timeoutId = window.setTimeout(() => {
    isWaiting = false;
  }, 2000); // cancel after 2s
}

function focusFirstInput() {
  const input = document.querySelector("input, textarea, [contenteditable]") as HTMLElement;
  if (input) input.focus();
}

function copyCurrentElement() {
  const el = document.querySelector('.vimsurf-highlight');
  if (!el) return;

  if (el instanceof HTMLImageElement) {
    navigator.clipboard.writeText(el.src);
  } else {
    navigator.clipboard.writeText(el.textContent ?? '');
  }
}
