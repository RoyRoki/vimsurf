export default interface Command {
  key: string;
  action: string;
  args?: object;
  modes?: string[];
  priority?: number;
}
