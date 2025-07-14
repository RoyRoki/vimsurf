export function injectHighlightStyle() {
  const style = document.createElement('style');
  style.textContent = `
.vimsurf-highlight {
  outline: 3px solid #00bfff !important;
  border-radius: 4px !important;
  transition: outline 0.15s ease;
}

.vimsurf-vis-range {
  background-color: rgba(0, 191, 255, 0.2) !important;
  outline: 2px dashed #00bfff !important;
  border-radius: 3px;
}

::selection {
  background: rgba(0, 191, 255, 0.3);
}

html[data-vimsurf-mode="normal"] input,
html[data-vimsurf-mode="normal"] textarea,
html[data-vimsurf-mode="normal"] [contenteditable],
html[data-vimsurf-mode="visual"] input,
html[data-vimsurf-mode="visual"] textarea,
html[data-vimsurf-mode="visual"] [contenteditable] {
  pointer-events: none !important;
  opacity: 0.5;
  user-select: none;
}
`;
  document.head.appendChild(style);
}
