// File: src/utils/storage.ts
// Helpers to gzip/minify manifests for chrome.storage.sync

import pako from 'pako';

export function compress(json: string): string {
  const bin = pako.gzip(json);
  return btoa(String.fromCharCode(...bin));
}

export function decompress(data: string): string {
  const bin = Uint8Array.from(atob(data), c => c.charCodeAt(0));
  return new TextDecoder().decode(pako.ungzip(bin));
}
