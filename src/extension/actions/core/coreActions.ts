import { PluginActionMap } from "extension/interfaces/named_action_mapsI";
import { scrollActions } from "./scroll/scrollActions";

export default function getCoreActions(): PluginActionMap {
  return {
    ...scrollActions,
  }
}

