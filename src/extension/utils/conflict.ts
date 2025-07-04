// File: src/utils/conflict.ts
// Detect key-binding collisions

import { ConflictEntry } from "../interfaces/conflictEntryI";
import PluginManifest from "../interfaces/pluginManifestI";

export function findConflicts(plugins: PluginManifest[]): ConflictEntry[] {
  const map = new Map<string, Set<string>>();
  for (const p of plugins) {
    for (const c of p.commands) {
      const modes = c.modes ?? ['normal'];
      for (const m of modes) {
        const k = `${m}:${c.key}`;
        if (!map.has(k)) map.set(k, new Set());
        map.get(k)!.add(p.name);
      }
    }
  }
  const conflicts: ConflictEntry[] = [];
  for (const [k, set] of map) {
    if (set.size > 1) {
      const [mode, key] = k.split(':');
      conflicts.push({ mode, key, plugins: Array.from(set) });
    }
  }
  return conflicts;
}
