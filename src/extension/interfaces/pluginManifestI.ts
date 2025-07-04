import Command from "./commandI";

export default interface PluginManifest {
  name: string;
  version: string;
  priority?: number;
  modes?: string[];
  commands: Command[];
  // ui?: {
  //   slot?: "overlay" | "sidebar" | "toolbar" | "statusbar";
  //   trigger?: string;
  // };
}
