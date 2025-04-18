import * as vscode from 'vscode';
import { GitHubStatusPanel } from '../webview/statusPanel';

export const showPanelCommand = 'gitHubStatus.showPanel';

export function registerShowStatusPanelCommand(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand(showPanelCommand, async () => {
    await GitHubStatusPanel.createOrShow(context.extensionUri);
    vscode.window.showInformationMessage('GitHub Status panel opened!');
  });

  context.subscriptions.push(command);

  return command;
}
