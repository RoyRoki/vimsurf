import { NamedActionMaps } from "extension/interfaces/named_action_maps";
import { scrollActions } from "./scrollActions";

const coreActions = {
  scroll: scrollActions,
}

export default function getCoreActions(): NamedActionMaps {
  return coreActions;
}
