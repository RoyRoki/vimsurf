import { NamedActionMaps } from "extension/interfaces/named_action_mapsI";

export function flattenActionMaps(named: NamedActionMaps): Record<string, Function> {
  return Object.entries(named).reduce((acc, [ns, map]) => {
    for (const [action, fn] of Object.entries(map)) {
      acc[`${ns}.${action}`] = fn;
    }
    return acc;
  }, {} as Record<string, Function>);
}
