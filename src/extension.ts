import * as vscode from 'vscode';
import { statusReq } from './api';
import { updateCommand } from './commands/update';
import ui from './ui';
import { getColor, getComponents, getTooltipText } from './service';
import { defaultInterval, extensionLogo, loadingText } from './shared/consts';

export const activate = (context: vscode.ExtensionContext) => {
  const updateStatus = async () => {
    try {
      const { data } = await statusReq;
      const components = getComponents(data);
      ui.color = getColor(components);
      ui.tooltip = getTooltipText(components);
    } catch (error) {
      // ! Uncomment this line to see error messages in the VSCode
      // vscode.window.showErrorMessage(`Error updating GitHub Status: ${error}`);
    }
  };

  const config = vscode.workspace.getConfiguration('gitHubStatus');
  const interval = (config.get<number>('interval') || defaultInterval) * 60 * 1000; // Convert to milliseconds
  const updateInterval = setInterval(updateStatus, interval);

  let update = vscode.commands.registerCommand(updateCommand, () => {
    updateStatus();
  });

  ui.tooltip = loadingText;
  ui.text = extensionLogo;
  ui.command = updateCommand;
  ui.show();

  context.subscriptions.push(update);
  context.subscriptions.push(ui);

  updateStatus();

  // Clear interval on extension deactivation
  context.subscriptions.push(
    vscode.Disposable.from(new vscode.Disposable(() => clearInterval(updateInterval))),
  );
};

export function deactivate() {}
