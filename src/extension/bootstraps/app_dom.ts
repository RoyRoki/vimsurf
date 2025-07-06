export class AppDom {
  private dom?: Document | HTMLElement;

  public setDom(dom: Document | HTMLElement): void {
    this.dom = dom;
  }

  public getDom(): Document | HTMLElement | undefined {
    return this.dom;
  }

  public query<T extends Element = Element>(selector: string): T | null {
    if (!this.dom) return null;
    return (this.dom as Document | Element).querySelector<T>(selector);
  }

  public appendChild(node: Node): void {
    if (this.dom instanceof HTMLElement) {
      this.dom.appendChild(node);
    } else {
      console.warn('AppDom: cannot appendChild—root is not an HTMLElement');
    }
  }
}

export const appDom = new AppDom();
