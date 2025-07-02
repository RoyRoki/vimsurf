// src/options/options.ts
const SCROLL_KEY = "scrollAmount";
const input = document.getElementById("scrollAmount") as HTMLInputElement;
const saveBtn = document.getElementById("save")!;

async function loadOptions() {
  const data = await chrome.storage.sync.get(SCROLL_KEY);
  input.value = (data[SCROLL_KEY] ?? 40).toString();
}

async function saveOptions() {
  const val = parseInt(input.value, 10) || 40;
  await chrome.storage.sync.set({ [SCROLL_KEY]: val });
  saveBtn.textContent = "Saved!";
  setTimeout(() => (saveBtn.textContent = "Save"), 1000);
}

saveBtn.addEventListener("click", saveOptions);
document.addEventListener("DOMContentLoaded", loadOptions);
