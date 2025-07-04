// File: src/background.ts
// MV3 Service Worker for privileged actions

chrome.runtime.onMessage.addListener((msg, sender) => {
  switch (msg.type) {
    case 'openTab':
      chrome.tabs.create({ url: msg.url, active: msg.active ?? true });
      break;
    case 'reloadTab':
      if (sender.tab?.id !== undefined) {
        chrome.tabs.reload(sender.tab.id);
      }
      break;
  }
});


