let copiedElement: HTMLElement | null = null;
let visualStartElement: HTMLElement | null = null;
let isVisualSelecting = false;

export function copyCurrentHighlight(): void {
  const el = document.querySelector('.vimsurf-highlight') as HTMLElement;
  if (!el) return;
  copiedElement = el.cloneNode(true) as HTMLElement;

  if (el instanceof HTMLImageElement) {
    navigator.clipboard.writeText(el.src);
  } else {
    navigator.clipboard.writeText(el.textContent?.trim() ?? '');
  }
}

export function pasteCopiedElement(): void {
  if (!copiedElement) return;
  const target = document.querySelector('.vimsurf-highlight') as HTMLElement;
  if (!target || !target.parentElement) return;

  const pasted = copiedElement.cloneNode(true) as HTMLElement;
  target.parentElement.insertBefore(pasted, target.nextSibling);

  pasted.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

export function startVisualSelection(): void {
  visualStartElement = document.querySelector('.vimsurf-highlight') as HTMLElement;
  clearVisualHighlights();
  if (visualStartElement) {
    visualStartElement.classList.add('vimsurf-vis-range');
    isVisualSelecting = true;
  }
}

export function updateVisualSelection(): void {
  if (!isVisualSelecting || !visualStartElement) return;

  const all = Array.from(document.querySelectorAll('[data-navigable], input, textarea, button, a')) as HTMLElement[];
  let inRange = false;
  let selected = false;

  all.forEach(el => {
    if (el === visualStartElement || el.classList.contains('vimsurf-highlight')) {
      selected = true;
      inRange = !inRange;
      el.classList.add('vimsurf-vis-range');
    } else if (inRange) {
      el.classList.add('vimsurf-vis-range');
    }
  });

  if (!selected) {
    const el = document.querySelector('.vimsurf-highlight') as HTMLElement;
    if (el) el.classList.add('vimsurf-vis-range');
  }
}

export function copyVisualSelection(): void {
  const rangeEls = Array.from(document.querySelectorAll('.vimsurf-vis-range')) as HTMLElement[];
  const texts = rangeEls.map(el => el.textContent?.trim() ?? '').filter(Boolean);
  navigator.clipboard.writeText(texts.join('\n'));
}

function clearVisualHighlights(): void {
  document.querySelectorAll('.vimsurf-vis-range').forEach(el => {
    el.classList.remove('vimsurf-vis-range');
  });
}

export function endVisualSelection(): void {
  isVisualSelecting = false;
  visualStartElement = null;
  clearVisualHighlights();
}

export function isInVisualSelection(): boolean {
  return isVisualSelecting;
}
