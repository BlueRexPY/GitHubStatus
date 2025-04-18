import * as vscode from 'vscode';

export class StatusBarUI {
  private statusBarItem: vscode.StatusBarItem;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  }

  public get tooltip(): string {
    return this.statusBarItem.tooltip as string;
  }

  public set tooltip(text: string) {
    this.statusBarItem.tooltip = text;
  }

  public get text(): string {
    return this.statusBarItem.text;
  }

  public set text(text: string) {
    this.statusBarItem.text = text;
  }

  public get color(): vscode.ThemeColor | undefined {
    return this.statusBarItem.color as vscode.ThemeColor | undefined;
  }

  public set color(color: string | vscode.ThemeColor | undefined) {
    if (typeof color === 'string') {
      if (color === 'none') {
        this.statusBarItem.color = undefined;
      } else {
        this.statusBarItem.color = new vscode.ThemeColor(`statusBarItem.${color}Foreground`);
      }
    } else {
      this.statusBarItem.color = color;
    }
  }

  public set command(command: string) {
    this.statusBarItem.command = command;
  }

  public show(): void {
    this.statusBarItem.show();
  }

  public hide(): void {
    this.statusBarItem.hide();
  }

  public dispose(): void {
    this.statusBarItem.dispose();
  }
}

export default new StatusBarUI();
