import { NamedActionMaps } from "extension/interfaces/named_action_maps";
import getCoreActions from "./core/coreActions";

const appActions = {
  ...getCoreActions(),
}

export default function getAppActions(): NamedActionMaps {
  return appActions;
}
