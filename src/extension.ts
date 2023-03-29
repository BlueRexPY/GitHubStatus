import * as vscode from "vscode";

// simple status bar item

export const activate = () => {
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBarItem.text = "Hello World";
  statusBarItem.show();
};
activate();

export const deactivate = () => {};
