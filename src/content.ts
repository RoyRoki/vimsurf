import Mousetrap from "mousetrap";

let mode: "normal" | "insert" = "normal";
let scrollAmount = 40;

// Load user setting
chrome.storage.sync.get("scrollAmount", data => {
  if (typeof data.scrollAmount === "number") {
    scrollAmount = data.scrollAmount;
  }
});

// Mode switching
document.addEventListener("focusin", e => {
  mode = (e.target as Element).matches("input, textarea, [contenteditable]")
    ? "insert" : "normal";
});

// Keybindings
Mousetrap.bind("j", () => {
  if (mode === "normal") window.scrollBy(0, scrollAmount);
});

Mousetrap.bind("k", () => {
  if (mode === "normal") window.scrollBy(0, -scrollAmount);
});

