import * as vscode from 'vscode';
import { updateCommand } from './commands/update';
import ui from './ui';
import { getColor, getComponents, getTooltipText, fetchGitHubStatusWithRetry } from './service';
import { defaultInterval, errorText, extensionLogo, loadingText } from './shared/consts';

export const activate = (context: vscode.ExtensionContext) => {
  let updateInterval: NodeJS.Timeout;

  const updateStatus = async (showErrors = false) => {
    try {
      ui.text = `${extensionLogo} $(sync~spin)`;

      const data = await fetchGitHubStatusWithRetry();

      if (!data) {
        ui.tooltip = errorText;
        ui.text = `${extensionLogo} $(warning)`;

        if (showErrors) {
          vscode.window.showErrorMessage(
            `Error updating GitHub Status: Could not connect to GitHub Status API.`,
          );
        }

        return;
      }

      const components = getComponents(data);
      ui.color = getColor(components);
      ui.tooltip = getTooltipText(components);
      ui.text = extensionLogo;
    } catch (error) {
      ui.tooltip = errorText;
      ui.text = `${extensionLogo} $(warning)`;

      if (showErrors) {
        vscode.window.showErrorMessage(
          `Error updating GitHub Status: ${error instanceof Error ? error.message : 'Unknown error'}`,
        );
      }
    }
  };

  const setupRefreshInterval = () => {
    if (updateInterval) {
      clearInterval(updateInterval);
    }

    const config = vscode.workspace.getConfiguration('githubStatus');
    const interval = (config.get<number>('refreshInterval') || defaultInterval) * 60 * 1000;
    updateInterval = setInterval(() => updateStatus(false), interval);
  };

  setupRefreshInterval();

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((event) => {
      if (event.affectsConfiguration('githubStatus.refreshInterval')) {
        setupRefreshInterval();
        vscode.window.showInformationMessage('GitHub Status refresh interval updated!');
      }
    }),
  );

  let update = vscode.commands.registerCommand(updateCommand, () => {
    updateStatus(true);
    vscode.window.showInformationMessage('GitHub Status update requested!');
  });

  ui.tooltip = loadingText;
  ui.text = extensionLogo;
  ui.command = updateCommand;
  ui.show();

  context.subscriptions.push(update);
  context.subscriptions.push(ui);

  updateStatus(false);

  context.subscriptions.push(
    vscode.Disposable.from(new vscode.Disposable(() => clearInterval(updateInterval))),
  );
};

export function deactivate() {}
