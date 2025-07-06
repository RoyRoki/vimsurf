import getAppActions from "extension/actions/appActions";
import { PluginManager } from "extension/managers/pluginM/plugin_managerM";
import { initModeService } from "extension/services/mode_switching_service";
import { initScrollService } from "extension/services/scroll_service";

// This Funtion start the applicaiton
export default function AppInit() {

  initModeService();
  initScrollService();

  const actions = getAppActions();
  const pluginManager = new PluginManager(actions);
  pluginManager.init().then(() => console.log('Vimsurf fully initialized!'))
    .catch(err => console.error('Failed to initialize plugins:', err));
}
