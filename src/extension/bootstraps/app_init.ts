import { PluginManager } from "extension/managers/plugin_manager";
import { initModeService } from "../services/mode_switching_service";
import { initScrollService } from "../services/scroll_service";
import getAppActions from "extension/actions/appActions";

// This Funtion start the applicaiton
export default function AppInit() {

  initModeService();
  initScrollService();

  const pluginManager = new PluginManager(getAppActions());
  pluginManager.init().then(() => console.log('Vimsurf fully initialized!'))
    .catch(err => console.error('Failed to initialize plugins:', err));
}
