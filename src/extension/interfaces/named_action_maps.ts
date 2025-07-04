export interface NamedActionMaps {
  [namespace: string]: {
    [action: string]: (args?: any) => void;
  };
}
