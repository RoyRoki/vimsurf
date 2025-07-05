import { NamedActionMaps } from "extension/interfaces/named_action_mapsI";
import getCoreActions from "./core/coreActions";

const appActions: NamedActionMaps = {
  // put coreActions under the "core" namespace:
  core: getCoreActions(),
};

export default function getAppActions(): NamedActionMaps {
  return appActions;
}

