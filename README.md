![Github status2](https://user-images.githubusercontent.com/66295121/232623319-5825c7a5-0599-4505-8f7b-9c2ce9379a17.png)

# GitHub Status

The GitHub Status extension for VS Code provides real-time information about the availability and performance of GitHub services. With this extension, you can easily track any GitHub service outages that may affect your development workflow.

## Features

- Visual indicator of the current status of GitHub services
- Interactive status bar item that changes color to reflect the current status of services
- Detailed dashboard with comprehensive information about GitHub services status
- View component status, active incidents, and scheduled maintenance
- Tab-based interface for easy navigation between different status categories
- Uses the GitHub API to ensure up-to-date information on service status
- Customizable refresh interval
- Perfect for developers who rely on GitHub for their workflow

## Installation

You can install the [GitHub Status](https://marketplace.visualstudio.com/items?itemName=RuslanRystsov.github-status) from the VS Code Marketplace. Simply search for "GitHub Status" in the extensions tab of your VS Code editor and click "Install."

## Usage

Once installed, the GitHub Status extension adds a status bar item to your VS Code editor. The status bar item displays the current status of GitHub services:

- 🟢 Green: All systems operational
- 🟠 Yellow: Minor or degraded performance issues
- 🔴 Red: Major outage or partial service disruption

### Detailed Status Dashboard

Click on the status bar item to open the **GitHub Status Dashboard** for more detailed information:

- **Components Tab**: Shows the operational status of individual GitHub services like Git Operations, API Requests, Issues, Pull Requests, etc.
- **Incidents Tab**: Displays active incidents with detailed information and updates
- **Maintenance Tab**: Shows scheduled maintenance activities

![GitHub Status GUI Dashboard](images/gui.png)

### Available Commands

The extension provides the following commands (accessible via Command Palette `Ctrl+Shift+P` / `Cmd+Shift+P`):

- **GitHub Status: Show Status Dashboard 📊** - Opens the detailed status dashboard
- **GitHub Status: Hard refresh 🔄** - Force updates the GitHub status information

## Configuration

You can configure the extension through VS Code settings:

- **GitHub Status: Refresh Interval** - Set how often (in minutes) the status should automatically update

## Contributing

If you'd like to contribute to the GitHub Status extension, feel free to submit a pull request. Before submitting, please ensure that your code adheres to the existing coding standards and has been thoroughly tested.

## License

The GitHub Status extension is licensed under the MIT License. See the [LICENSE](https://github.com/BlueRexPY/GitHubStatus/blob/main/LICENSE) file for more information.

![GitHub Status Dashboard](https://user-images.githubusercontent.com/66295121/232742608-b1447c98-3e62-4556-a8da-164a114017cb.png)

<div align="center">
  <img src="https://img.shields.io/badge/VSCODE-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white"/>
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white"/>
  <img src="https://img.shields.io/badge/webpack-%238DD6F9.svg?style=for-the-badge&logo=webpack&logoColor=black"/>
  <img src="https://img.shields.io/badge/pnpm-%234a4a4a.svg?style=for-the-badge&logo=pnpm&logoColor=f69220"/>
</div>
