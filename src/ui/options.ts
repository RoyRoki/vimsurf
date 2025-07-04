import Ajv from 'ajv';
import { findConflicts } from '../extension/utils/conflict';
import { compress, decompress } from '../extension/utils/storage';
import schema from '../plugin-schema.json';

const ajv = new Ajv();
const validate = ajv.compile(schema);

const uploadInput = document.getElementById('upload') as HTMLInputElement;
const installBtn = document.getElementById('install')!;
const listEl = document.getElementById('plugin-list')!;

installBtn.addEventListener('click', async () => {
  if (!uploadInput.files?.length) return alert('Select a JSON file.');
  const file = uploadInput.files[0];
  const text = await file.text();
  let json;
  try { json = JSON.parse(text); }
  catch { return alert('Invalid JSON.'); }
  if (!validate(json)) return alert('Schema error: ' + ajv.errorsText(validate.errors));

  // load existing
  const data = await chrome.storage.sync.get('userPlugins');
  const arr: string[] = data.userPlugins || [];
  arr.push(compress(JSON.stringify(json)));
  await chrome.storage.sync.set({ userPlugins: arr });
  alert('Plugin installed! Refresh pages to activate.');
  renderList();
});

async function renderList() {
  listEl.innerHTML = '';
  const data = await chrome.storage.sync.get('userPlugins');
  const arr: string[] = data.userPlugins || [];
  arr.forEach((comp, idx) => {
    let manifest;
    try { manifest = JSON.parse(decompress(comp)); }
    catch { return; }
    const li = document.createElement('li');
    li.textContent = `${manifest.name} (${manifest.version})`;
    listEl.appendChild(li);
  });

  // show conflicts
  const all = await loadAllManifests();
  const conflicts = findConflicts(all);
  conflicts.forEach(c => {
    const p = document.createElement('p');
    p.textContent = `Conflict: [${c.mode}] ${c.key} in ${c.plugins.join(', ')}`;
    listEl.appendChild(p);
  });
}

async function loadAllManifests() {
  // fetch built-in
  const builtInUrls = ['default.json', 'tabManagement.json'];
  const list: any[] = [];
  for (const file of builtInUrls) {
    const url = chrome.runtime.getURL(`plugins/${file}`);
    const json = await fetch(url).then(r => r.json());
    list.push(json);
  }
  // user
  const data = await chrome.storage.sync.get('userPlugins');
  for (const comp of (data.userPlugins || [])) {
    try { list.push(JSON.parse(decompress(comp))); } catch { };
  }
  return list;
}

// init
renderList();

