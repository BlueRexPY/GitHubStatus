import * as vscode from 'vscode';
import { updateCommand } from './commands/update';
import { showPanelCommand, registerShowStatusPanelCommand } from './commands/showStatusPanel';
import ui from './ui';
import { getColor, getComponents, getTooltipText, fetchGitHubStatusWithRetry } from './service';
import { defaultInterval, errorText, extensionLogo, loadingText } from './shared/consts';
import { GitHubStatusPanel } from './webview/statusPanel';

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

      // Update the WebView panel if it exists
      if (GitHubStatusPanel.currentPanel) {
        GitHubStatusPanel.currentPanel.updateContent(data);
      }
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

  // Register commands
  let update = vscode.commands.registerCommand(updateCommand, () => {
    updateStatus(true);
    vscode.window.showInformationMessage('GitHub Status update requested!');
  });

  // Register the show panel command
  const showPanel = registerShowStatusPanelCommand(context);

  // Set up status bar item
  ui.tooltip = loadingText;
  ui.text = extensionLogo;
  ui.command = showPanelCommand; // Change the command to open the panel instead of just updating
  ui.show();

  context.subscriptions.push(update);
  context.subscriptions.push(showPanel);
  context.subscriptions.push(ui);

  updateStatus(false);

  context.subscriptions.push(
    vscode.Disposable.from(new vscode.Disposable(() => clearInterval(updateInterval))),
  );
};

export function deactivate() {
  if (GitHubStatusPanel.currentPanel) {
    GitHubStatusPanel.currentPanel.dispose();
  }
}
