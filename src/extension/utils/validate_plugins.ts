import PluginManifest from "extension/interfaces/pluginManifestI";

export interface ValidationError {
  path: string;       // e.g. "commands[2].args.foo"
  message: string;    // e.g. "must be a string"
}

export function validatePlugin(
  manifest: any
): { valid: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];

  // top‐level must be object
  if (typeof manifest !== 'object' || manifest === null || Array.isArray(manifest)) {
    errors.push({ path: '', message: 'manifest must be an object' });
    return { valid: false, errors };
  }

  // required fields
  for (const field of ['name', 'version', 'commands'] as const) {
    if (!(field in manifest)) {
      errors.push({ path: field, message: 'is required' });
    }
  }

  // name: string
  if ('name' in manifest && typeof manifest.name !== 'string') {
    errors.push({ path: 'name', message: 'must be a string' });
  }

  // version: string matching ^\d+\.\d+\.\d+$
  if ('version' in manifest) {
    if (typeof manifest.version !== 'string') {
      errors.push({ path: 'version', message: 'must be a string' });
    } else if (!/^\d+\.\d+\.\d+$/.test(manifest.version)) {
      errors.push({ path: 'version', message: 'must match semver (x.y.z)' });
    }
  }

  // priority?: integer ≥ 0
  if ('priority' in manifest) {
    if (!Number.isInteger(manifest.priority)) {
      errors.push({ path: 'priority', message: 'must be an integer' });
    } else if (manifest.priority < 0) {
      errors.push({ path: 'priority', message: 'must be ≥ 0' });
    }
  }

  // modes?: string[] limited to the four enums
  const modeEnum = new Set([
    'normal', 'insert', 'visual', 'operator-pending'
  ]);
  if ('modes' in manifest) {
    if (!Array.isArray(manifest.modes)) {
      errors.push({ path: 'modes', message: 'must be an array' });
    } else {
      manifest.modes.forEach((m: any, i: number) => {
        if (typeof m !== 'string') {
          errors.push({ path: `modes[${i}]`, message: 'must be a string' });
        } else if (!modeEnum.has(m)) {
          errors.push({
            path: `modes[${i}]`,
            message: `must be one of ${[...modeEnum].join(', ')}`
          });
        }
      });
    }
  }

  // commands: required array
  if ('commands' in manifest) {
    if (!Array.isArray(manifest.commands)) {
      errors.push({ path: 'commands', message: 'must be an array' });
    } else if (manifest.commands.length === 0) {
      errors.push({ path: 'commands', message: 'must have at least one entry' });
    } else {
      manifest.commands.forEach((cmd: any, idx: number) => {
        const base = `commands[${idx}]`;

        if (typeof cmd !== 'object' || cmd === null || Array.isArray(cmd)) {
          errors.push({ path: base, message: 'must be an object' });
          return;
        }

        // required fields: key, action
        for (const f of ['key', 'action'] as const) {
          if (!(f in cmd)) {
            errors.push({ path: `${base}.${f}`, message: 'is required' });
          }
        }

        if ('key' in cmd && typeof cmd.key !== 'string') {
          errors.push({ path: `${base}.key`, message: 'must be a string' });
        }
        if ('action' in cmd && typeof cmd.action !== 'string') {
          errors.push({ path: `${base}.action`, message: 'must be a string' });
        }

        // args?: object
        if ('args' in cmd) {
          if (typeof cmd.args !== 'object' || cmd.args === null || Array.isArray(cmd.args)) {
            errors.push({ path: `${base}.args`, message: 'must be an object' });
          }
        }

        // modes?: array of strings
        if ('modes' in cmd) {
          if (!Array.isArray(cmd.modes)) {
            errors.push({ path: `${base}.modes`, message: 'must be an array' });
          } else {
            cmd.modes.forEach((m: any, j: number) => {
              if (typeof m !== 'string') {
                errors.push({ path: `${base}.modes[${j}]`, message: 'must be a string' });
              }
            });
          }
        }

        // priority?: integer ≥ 0
        if ('priority' in cmd) {
          if (!Number.isInteger(cmd.priority)) {
            errors.push({ path: `${base}.priority`, message: 'must be an integer' });
          } else if (cmd.priority < 0) {
            errors.push({ path: `${base}.priority`, message: 'must be ≥ 0' });
          }
        }
      });
    }
  }

  // ui?: object
  if ('ui' in manifest) {
    if (typeof manifest.ui !== 'object' || manifest.ui === null || Array.isArray(manifest.ui)) {
      errors.push({ path: 'ui', message: 'must be an object' });
    } else {
      if ('slot' in manifest.ui) {
        const slot = manifest.ui.slot;
        if (!['overlay', 'sidebar', 'toolbar', 'statusbar'].includes(slot)) {
          errors.push({
            path: 'ui.slot',
            message: 'must be one of overlay, sidebar, toolbar, statusbar'
          });
        }
      }
      if ('trigger' in manifest.ui && typeof manifest.ui.trigger !== 'string') {
        errors.push({ path: 'ui.trigger', message: 'must be a string' });
      }
    }
  }

  return { valid: errors.length === 0, errors };
}


/**
 * Validate many manifests at once.
 */
export function validatePlugins(
  manifests: any[]
): {
  validPlugins: PluginManifest[];
  invalid: Array<{ manifest: any; errors: ValidationError[] }>;
} {
  const validPlugins: PluginManifest[] = [];
  const invalid: Array<{ manifest: any; errors: ValidationError[] }> = [];

  for (const manifest of manifests) {
    const { valid, errors } = validatePlugin(manifest);
    if (valid) validPlugins.push(manifest);
    else invalid.push({ manifest, errors });
  }

  return { validPlugins, invalid };
}

