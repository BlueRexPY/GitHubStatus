import * as vscode from 'vscode';
import { IData } from '../shared/types';
import { getComponents, fetchGitHubStatusWithRetry } from '../service';

export class GitHubStatusPanel {
  public static currentPanel: GitHubStatusPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private _disposables: vscode.Disposable[] = [];
  private _extensionUri: vscode.Uri;
  private _data: IData | null = null;

  public static async createOrShow(extensionUri: vscode.Uri) {
    const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

    // If we already have a panel, show it
    if (GitHubStatusPanel.currentPanel) {
      GitHubStatusPanel.currentPanel._panel.reveal(column);
      return;
    }

    // Otherwise, create a new panel
    const panel = vscode.window.createWebviewPanel(
      'githubStatusPanel',
      'GitHub Status',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      },
    );

    GitHubStatusPanel.currentPanel = new GitHubStatusPanel(panel, extensionUri);

    // Prefetch data immediately
    try {
      const data = await fetchGitHubStatusWithRetry();
      if (GitHubStatusPanel.currentPanel) {
        GitHubStatusPanel.currentPanel._data = data;

        // Send the data once the webview is ready
        setTimeout(() => {
          if (GitHubStatusPanel.currentPanel) {
            GitHubStatusPanel.currentPanel.updateContent(data);
          }
        }, 1000); // Give the webview time to initialize
      }
    } catch (error) {
      console.error('Error fetching GitHub status:', error);
    }
  }

  public static dispose() {
    GitHubStatusPanel.currentPanel?.dispose();
    GitHubStatusPanel.currentPanel = undefined;
  }

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    // Set the webview's initial html content
    this._update();

    // Listen for when the panel is disposed
    // This happens when the user closes the panel or when the panel is closed programmatically
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    // Update the content based on view changes
    this._panel.onDidChangeViewState(
      () => {
        if (this._panel.visible && this._data) {
          this.updateContent(this._data);
        }
      },
      null,
      this._disposables,
    );

    // Handle messages from the webview
    this._panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case 'refresh':
            this._fetchAndUpdateContent();
            return;
          case 'webview-ready':
            // Webview is ready, send data if we have it
            if (this._data) {
              this.updateContent(this._data);
            } else {
              this._fetchAndUpdateContent();
            }
            return;
        }
      },
      null,
      this._disposables,
    );
  }

  public dispose() {
    GitHubStatusPanel.currentPanel = undefined;
    this._panel.dispose();

    while (this._disposables.length) {
      const disposable = this._disposables.pop();
      if (disposable) {
        disposable.dispose();
      }
    }
  }

  public updateContent(data: IData | null) {
    if (!this._panel.visible) {
      return;
    }

    if (!data) {
      this._panel.webview.postMessage({
        command: 'update-status',
        data: { error: true },
      });
      return;
    }

    this._data = data; // Store for later use

    const statusInfo = {
      components: data.components || [],
      page: data.page || {},
      status: data.status || { description: 'Unknown' },
      incidents: data.incidents || [],
      scheduled_maintenances: data.scheduled_maintenances || [],
      lastUpdated: new Date().toLocaleString(),
    };

    // Send the data to the webview
    this._panel.webview.postMessage({
      command: 'update-status',
      data: statusInfo,
    });
  }

  private _update() {
    this._panel.title = 'GitHub Status';
    this._panel.webview.html = this._getHtmlForWebview();
  }

  private _getHtmlForWebview() {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GitHub Status</title>
        <style>
            body {
                padding: 20px;
                color: var(--vscode-foreground);
                font-family: var(--vscode-font-family);
                font-size: var(--vscode-font-size);
                background-color: var(--vscode-editor-background);
                margin: 0;
            }
            .component {
                margin-bottom: 16px;
                padding: 10px;
                border-radius: 4px;
                background-color: var(--vscode-editor-background);
                border: 1px solid var(--vscode-panel-border);
            }
            .component-header {
                display: flex;
                align-items: center;
                margin-bottom: 5px;
            }
            .status-circle {
                width: 12px;
                height: 12px;
                border-radius: 50%;
                margin-right: 8px;
                flex-shrink: 0;
            }
            .operational { background-color: #4caf50; }
            .degraded_performance { background-color: #ff9800; }
            .partial_outage { background-color: #ff5722; }
            .major_outage { background-color: #f44336; }
            .maintenance { background-color: #2196f3; }
            
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            .incident {
                margin-top: 10px;
                padding: 10px;
                border-left: 4px solid #ff5722;
                background-color: var(--vscode-editor-background);
            }
            .maintenance-item {
                margin-top: 10px;
                padding: 10px;
                border-left: 4px solid #2196f3;
                background-color: var(--vscode-editor-background);
            }
            .last-updated {
                font-size: 12px;
                color: var(--vscode-descriptionForeground);
                text-align: right;
                margin-top: 15px;
            }
            .loading {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                height: 200px;
            }
            .error {
                color: #f44336;
                text-align: center;
                padding: 20px;
                border: 1px solid #f44336;
                border-radius: 4px;
                margin-top: 20px;
            }
            button {
                padding: 6px 14px;
                background: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                border-radius: 2px;
                cursor: pointer;
            }
            button:hover {
                background: var(--vscode-button-hoverBackground);
            }
            .spinner {
                width: 30px;
                height: 30px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: var(--vscode-button-background);
                animation: spin 1s ease-in-out infinite;
                margin-bottom: 10px;
            }
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
            .tabs { margin-bottom: 20px; }
            .tabs button {
                background: transparent;
                border: none;
                padding: 8px 16px;
                margin-right: 4px;
                border-bottom: 2px solid transparent;
            }
            .tabs button.active {
                border-bottom: 2px solid var(--vscode-button-background);
                font-weight: bold;
            }
            .tab-content { display: none; }
            .tab-content.active { display: block; }
            h3 { margin-top: 0; }
            .divider {
                height: 1px;
                background-color: var(--vscode-panel-border);
                margin: 15px 0;
            }
        </style>
    </head>
    <body>
        <div class="header">
            <h2>GitHub Status</h2>
            <button id="refresh-btn">Refresh</button>
        </div>
        
        <div id="status-container">
            <div class="loading">
                <div class="spinner"></div>
                <span>Loading GitHub status...</span>
            </div>
        </div>
        
        <script>
            const vscode = acquireVsCodeApi();
            const refreshBtn = document.getElementById('refresh-btn');
            const statusContainer = document.getElementById('status-container');
            
            // Signal that the webview is ready to receive data
            document.addEventListener('DOMContentLoaded', () => {
                console.log('DOM fully loaded, sending ready message');
                setTimeout(() => {
                    vscode.postMessage({ command: 'webview-ready' });
                }, 300);
            });
            
            refreshBtn.addEventListener('click', () => {
                statusContainer.innerHTML = \`<div class="loading">
                    <div class="spinner"></div>
                    <span>Loading GitHub status...</span>
                </div>\`;
                vscode.postMessage({ command: 'refresh' });
            });
            
            window.addEventListener('message', event => {
                const message = event.data;
                
                switch (message.command) {
                    case 'update-status':
                        updateStatus(message.data);
                        break;
                }
            });
            
            function updateStatus(data) {
                if (data.error) {
                    statusContainer.innerHTML = \`
                        <div class="error">
                            <h3>Error fetching GitHub status</h3>
                            <p>Unable to connect to GitHub Status API. Please try again later.</p>
                        </div>
                    \`;
                    return;
                }
                
                try {
                    // Create tab structure
                    let html = \`
                        <div class="tabs">
                            <button class="tab-btn active" data-tab="components">Components</button>
                            <button class="tab-btn" data-tab="incidents">Incidents</button>
                            <button class="tab-btn" data-tab="maintenance">Maintenance</button>
                        </div>
                        
                        <div id="components" class="tab-content active">
                            <div class="overall-status">
                                <h3>Overall Status: \${data.status.description}</h3>
                            </div>
                            <div class="divider"></div>
                            <h3>Components</h3>
                            <div class="components-list">
                    \`;
                    
                    // Add components
                    if (Array.isArray(data.components)) {
                        data.components.forEach(component => {
                            html += \`
                                <div class="component">
                                    <div class="component-header">
                                        <div class="status-circle \${component.status}"></div>
                                        <strong>\${component.name}</strong>
                                    </div>
                                    <div>\${getStatusText(component.status)}</div>
                                </div>
                            \`;
                        });
                    }
                    
                    html += \`
                            </div>
                        </div>
                        
                        <div id="incidents" class="tab-content">
                            <h3>Active Incidents</h3>
                    \`;
                    
                    // Add incidents
                    if (Array.isArray(data.incidents) && data.incidents.length > 0) {
                        data.incidents.forEach(incident => {
                            const updates = incident.incident_updates && incident.incident_updates.length > 0 
                                ? incident.incident_updates[0].body 
                                : 'No updates';
                            const updatedAt = incident.updated_at ? new Date(incident.updated_at).toLocaleString() : 'Unknown';
                            
                            html += \`
                                <div class="incident">
                                    <h4>\${incident.name || 'Unnamed incident'}</h4>
                                    <p>\${incident.status || 'Status unknown'}</p>
                                    <p>\${updates}</p>
                                    <small>Updated: \${updatedAt}</small>
                                </div>
                            \`;
                        });
                    } else {
                        html += \`<p>No active incidents</p>\`;
                    }
                    
                    html += \`
                        </div>
                        
                        <div id="maintenance" class="tab-content">
                            <h3>Scheduled Maintenance</h3>
                    \`;
                    
                    // Add maintenance
                    if (Array.isArray(data.scheduled_maintenances) && data.scheduled_maintenances.length > 0) {
                        data.scheduled_maintenances.forEach(maintenance => {
                            const updates = maintenance.incident_updates && maintenance.incident_updates.length > 0 
                                ? maintenance.incident_updates[0].body 
                                : 'No updates';
                            const scheduledFor = maintenance.scheduled_for ? new Date(maintenance.scheduled_for).toLocaleString() : 'Unknown';
                            
                            html += \`
                                <div class="maintenance-item">
                                    <h4>\${maintenance.name || 'Unnamed maintenance'}</h4>
                                    <p>\${maintenance.status || 'Status unknown'}</p>
                                    <p>\${updates}</p>
                                    <small>Scheduled for: \${scheduledFor}</small>
                                </div>
                            \`;
                        });
                    } else {
                        html += \`<p>No scheduled maintenance</p>\`;
                    }
                    
                    html += \`
                        </div>
                        <div class="last-updated">Last updated: \${data.lastUpdated}</div>
                    \`;
                    
                    statusContainer.innerHTML = html;
                    
                    // Set up tab switching
                    document.querySelectorAll('.tab-btn').forEach(button => {
                        button.addEventListener('click', () => {
                            const tabId = button.getAttribute('data-tab');
                            
                            // Hide all tabs and remove active class
                            document.querySelectorAll('.tab-content').forEach(tab => {
                                tab.classList.remove('active');
                            });
                            document.querySelectorAll('.tab-btn').forEach(btn => {
                                btn.classList.remove('active');
                            });
                            
                            // Show selected tab and add active class
                            document.getElementById(tabId).classList.add('active');
                            button.classList.add('active');
                        });
                    });
                } catch (error) {
                    console.error('Error rendering status:', error);
                    statusContainer.innerHTML = \`
                        <div class="error">
                            <h3>Error displaying GitHub status</h3>
                            <p>An error occurred while displaying the status: \${error.message}</p>
                        </div>
                    \`;
                }
            }
            
            function getStatusText(status) {
                switch(status) {
                    case 'operational':
                        return 'Operational';
                    case 'degraded_performance':
                        return 'Degraded Performance';
                    case 'partial_outage':
                        return 'Partial Outage';
                    case 'major_outage':
                        return 'Major Outage';
                    case 'maintenance':
                        return 'Under Maintenance';
                    default:
                        return 'Unknown Status';
                }
            }
        </script>
    </body>
    </html>`;
  }

  private async _fetchAndUpdateContent() {
    try {
      const data = await fetchGitHubStatusWithRetry();
      if (data) {
        this.updateContent(data);
      } else {
        this._panel.webview.postMessage({
          command: 'update-status',
          data: { error: true },
        });
      }
    } catch (error) {
      console.error('Error fetching GitHub status:', error);
      this._panel.webview.postMessage({
        command: 'update-status',
        data: { error: true },
      });
      vscode.window.showErrorMessage(
        `Error fetching GitHub status: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }
}
