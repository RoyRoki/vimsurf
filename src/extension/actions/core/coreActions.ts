import { PluginActionMap } from "extension/interfaces/named_action_mapsI";
import { scrollActions } from "./scroll/scrollActions";
import { modeActions } from "./mode/modeActions";

export default function getCoreActions(): PluginActionMap {
  return {
    ...scrollActions,
    ...modeActions
  }
}

