import * as vscode from "vscode";

export const activate = (context: vscode.ExtensionContext) => {
  const myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  myStatusBarItem.text = "Hello World";
  myStatusBarItem.show();

  context.subscriptions.push(
    vscode.commands.registerCommand("myExtension.updateStatus", () => {
      myStatusBarItem.text = "Updated Text";
    })
  );
};

export const deactivate = () => {};
