import Mousetrap from 'mousetrap';
import { triggerLeader, handleLeaderKey } from 'extension/services/leader_service';
import { initModeService } from 'extension/services/mode_switching_service';
import getAppActions from 'extension/actions/appActions';
import { PluginManager } from 'extension/managers/pluginM/plugin_managerM';
import { initScrollService } from 'extension/services/scroll_service';
import { initSpatialNavService } from 'extension/services/spatial_nav_service';

export default function AppInit() {
  initModeService();
  initScrollService();
  initSpatialNavService();

  // Leader key (\)
  Mousetrap.bind('\\', () => {
    triggerLeader();
    return false;
  });

  // Listen for second key after leader
  'abcdefghijklmnopqrstuvwxyz'.split('').forEach(key => {
    Mousetrap.bind(key, () => {
      handleLeaderKey(key);
      return false;
    });
  });

  const actions = getAppActions();
  const pluginManager = new PluginManager(actions);
  pluginManager.init().then(() => console.log('Vimsurf fully initialized!'));
}
