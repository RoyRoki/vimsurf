import { PluginActionMap } from "extension/interfaces/named_action_mapsI";
import { setCurrentMode } from "extension/services/mode_switching_service";
import { copyCurrentHighlight, copyVisualSelection, pasteCopiedElement, isInVisualSelection } from "extension/services/visual_clipboard_service";

export const modeActions: PluginActionMap = {
  enterInsertMode: () => setCurrentMode("insert"),
  enterVisualMode: () => setCurrentMode("visual"),
  enterNormalMode: () => setCurrentMode("normal"),

  copyHighlightOrVisual: () => {
    if (isInVisualSelection()) copyVisualSelection();
    else copyCurrentHighlight();
  },

  pasteCopiedElement: () => pasteCopiedElement(),
};
