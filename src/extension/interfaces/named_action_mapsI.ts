export interface PluginActionMap {
  [actionn: string]: (args?: any) => void;
}
export interface NamedActionMaps {
  [namespace: string]: PluginActionMap;
};
