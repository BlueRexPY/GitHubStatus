import * as vscode from 'vscode';
import { getStatus } from './api';
import { updateCommand } from './commands/update';
import ui from './ui';
import { getColor, getComponents, getTooltipText } from './service';

export const activate = (context: vscode.ExtensionContext) => {
  let update = vscode.commands.registerCommand(updateCommand, () => {
    vscode.window.showInformationMessage('GitHub Status - Updated!');
    updateStatus();
  });

  const updateStatus = async () => {
    const data = await getStatus();
    const components = getComponents(data);
    ui.color = getColor(components);
    ui.tooltip = getTooltipText(components);
  };

  // subscribe to api updates
  const config = vscode.workspace.getConfiguration('gitHubStatus');
  const interval = (config.get('interval') as number) || 5; // default 5 minutes
  setInterval(() => {
    updateStatus();
  }, interval * 60 * 1000); // convert minutes to milliseconds

  // initial config
  ui.tooltip = 'GitHub Status';
  ui.text = '$(github-inverted)';
  // register up
  ui.command = updateCommand;
  ui.show();
  context.subscriptions.push(update);
  context.subscriptions.push(ui);
  // initial update
  updateStatus();
};

export function deactivate() {}
