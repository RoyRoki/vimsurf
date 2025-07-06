import { LocalKeys } from '../extension/constants/LocalKeys';
import { validateScrollAmount } from '../extension/services/scroll_service';

const scrollInput = document.getElementById('scroll-step') as HTMLInputElement;
const saveBtn = document.getElementById('save')!;
const statusEl = document.getElementById('status')!;

// Initialize the input with current stored value (or default)
chrome.storage.sync.get(LocalKeys.scrollAmount, data => {
  if (typeof data[LocalKeys.scrollAmount] === 'number') {
    scrollInput.value = data[LocalKeys.scrollAmount].toString();
  }
});

// Save button handler
saveBtn.addEventListener('click', () => {
  const val = Number(scrollInput.value);
  if (!validateScrollAmount(val)) {
    statusEl.textContent = 'Please enter a number between 0 and 1000.';
    setTimeout(() => (statusEl.textContent = ''), 2000);
    return;
  }

  // Persist to storage
  chrome.storage.sync.set({ [LocalKeys.scrollAmount]: val }, () => {
    statusEl.textContent = 'Saved!';
    setTimeout(() => (statusEl.textContent = ''), 2000);
  });
  chrome.storage.sync.get(LocalKeys.scrollAmount, data => {
    if (typeof data.scrollAmount === "number" && validateScrollAmount(data.scrollAmount)) {
      console.debug(data.scrollAmount);
    }
  });
});

