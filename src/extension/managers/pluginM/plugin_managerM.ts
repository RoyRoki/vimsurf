import Mousetrap from 'mousetrap';
import { AppConstants } from '../../constants/AppConstants';
import { ConflictEntry } from '../../interfaces/conflictEntryI';
import PluginManifest from '../../interfaces/pluginManifestI';
import { getCurrentMode } from '../../services/mode_switching_service';
import { findConflicts } from '../../utils/conflict';
import { flattenActionMaps } from '../../utils/flatten_action_maps';
import { validatePlugins } from '../../utils/validate_plugins';
import { NamedActionMaps } from 'extension/interfaces/named_action_mapsI';

export class PluginManager {
  private manifests: PluginManifest[] = [];
  private actionMap: Record<string, Function>;

  constructor(private namedMaps: NamedActionMaps) {
    this.actionMap = flattenActionMaps(namedMaps);
  }

  /** Bootstrap: load, validate, resolve, and bind plugins */
  public async init(): Promise<void> {
    await this.loadAndValidate();
    this.resolveConflicts();
    this.bindAll();
    console.log(
      `[PluginManager] Loaded plugins: ${this.manifests.map(p => p.name).join(', ')}`
    );
  }

  /** Load built-in + user plugins and validate them */
  public async loadAndValidate(): Promise<void> {
    const builtIn = await this.loadBuiltIn();
    const user = await this.loadUser();
    const raw = [...builtIn, ...user];

    const { validPlugins, invalid } = validatePlugins(raw);
    invalid.forEach(({ manifest, errors }) =>
      console.error('[PluginManager] Invalid plugin', manifest, errors)
    );

    this.manifests = validPlugins;
  }

  /** Detect and unbind conflicting keybindings */
  public resolveConflicts(): void {
    const conflicts: ConflictEntry[] = findConflicts(this.manifests);
    conflicts.forEach(({ mode, key, plugins }, idx) => {
      console.warn(
        `[PluginManager] Conflict #${idx + 1} on key="${key}" in mode="${mode}" among:`,
        plugins
      );
      // Unbind this key for all but the first plugin
      plugins.slice(1).forEach(() => {
        Mousetrap.unbind(key);
      });
    });
  }

  /** Bind all validated, non-conflicting commands */
  public bindAll(): void {
    Mousetrap.reset();

    this.manifests.forEach(manifest => {
      manifest.commands.forEach(cmd => {
        const combo = cmd.key;
        Mousetrap.bind(combo, (e: KeyboardEvent) => {
          e.preventDefault();
          // Check mode dynamically
          const currentMode = getCurrentMode();
          if (cmd.modes && !cmd.modes.includes(currentMode)) {
            return;
          }
          // Invoke the mapped handler
          const handler = this.actionMap[cmd.action];
          if (handler) {
            handler(cmd.args);
          } else {
            console.warn(`[PluginManager] No handler for action "${cmd.action}"`);
          }
        });
      });
    });
  }


  private async loadBuiltIn(): Promise<PluginManifest[]> {
    try {
      const context = (require as any).context(
        '../../../plugins',
        false,
        /\.json$/
      );

      const keys = context.keys();
      console.debug('[PluginManager] Discovered plugin files:', keys);

      const manifests = keys.map((key: string) => {
        const mod = context(key);
        console.debug(`[PluginManager] Loaded plugin module for ${key}:`, mod);
        return mod as PluginManifest;
      });

      return manifests;
    } catch (err) {
      console.warn(
        '[PluginManager] Failed to load built-in plugins via context',
        err
      );
      return [];
    }
  }


  private loadUser(): Promise<PluginManifest[]> {
    return new Promise(resolve => {
      chrome.storage.sync.get(AppConstants.userPluginsKey, data => {
        const arr: PluginManifest[] = [];
        (data[AppConstants.userPluginsKey] || []).forEach((enc: string) => {
          try {
            arr.push(JSON.parse(atob(enc)) as PluginManifest);
          } catch {
            // skip invalid entries
          }
        });
        resolve(arr);
      });
    });
  }
}

