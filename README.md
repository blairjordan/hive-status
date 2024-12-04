# Hive Status Extension

> **Note:** This extension is currently built for [hive.devmode.digital](hive.devmode.digital).
> If you'd like to expand its compatibility, please consider opening a PR to make the POST request format more configurable.

The Hive Status Extension helps you reflect your coding activity and workspace details into a remote service (referred to as the "Status Service"). By doing so, you can showcase what you're working on, how long you've been working, and other context about your current coding session.

This extension can send details such as:

- Your current file and workspace
- Whether you're actively editing, viewing files, debugging, or idle
- Problems and diagnostic counts from your project
- Customizable status messages and more

**Note:** Your privacy is important. You can enable "Privacy Mode" to hide file, workspace, and repository details.

## How It Works

1. When enabled, the extension periodically sends activity updates to a GraphQL API endpoint.
2. These updates include a `playerSecret` that authenticates your updates to the remote service.
3. The remote service can then display or use the received status information.

## Getting Started

### Installation

1. Install the Hive Status extension into VS Code.
2. In [Hive](hive.devmode.digital), locate your API Key by going to your profile (⚙️ icon) and copying the "API Key".
3. In VS Code, open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS) and run the command `Hive Status: Set Player Secret`.
4. After installation, the extension will attempt to connect to the configured endpoint and show a status message in the VS Code status bar.

### Basic Usage

Once enabled, the extension:

- Tracks your activity whenever you switch files, edit code, navigate between lines, or start/stop debugging sessions.
- Identifies when you become idle and can optionally disconnect or update your status to "Idle" after a certain period of inactivity.

You can control it using the following commands (open the Command Palette in VS Code with `Ctrl+Shift+P` or `Cmd+Shift+P` on macOS):

- **Enable Hive Status**: `hive-status.enable`
- **Disable Hive Status**: `hive-status.disable`
- **Enable Hive Status (Workspace)**: `hive-status.workspace.enable`
- **Disable Hive Status (Workspace)**: `hive-status.workspace.disable`
- **Enable Privacy Mode**: `hive-status.enablePrivacyMode`
- **Disable Privacy Mode**: `hive-status.disablePrivacyMode`
- **Set Player Secret**: `hive-status.setPlayerSecret`

## Important Settings

You can configure these settings in VS Code. Go to **Settings** (File > Preferences > Settings) and search for **"Hive Status"** or **"hive-status"**.

### Required Settings

- **`hive-status.app.apiEndpoint`** (Default: `https://api.devmode.digital/graphql`)  
  The remote GraphQL API endpoint that receives your status updates.  
  Example: `https://your-service.com/graphql`

- **`hive-status.app.playerSecret`** (Default: `""`)  
  A secret key or token provided by your status service. This authenticates your status updates so that only you can modify your status.  
  Example: `mySuperSecretKey123`

### Other Notable Settings

- **`hive-status.app.privacyMode.enable`** (Default: `false`)  
  If set to `true`, details like repository, filename, and workspace will be hidden.
- **`hive-status.status.showElapsedTime`** (Default: `true`)  
  Enables display of how long you've been active in the current session or file.
- **`hive-status.status.idle.enabled`** (Default: `true`)  
  Determines if idle mode is tracked and displayed.
- **`hive-status.status.idle.timeout`** (Default: `300` seconds)  
  Time before you're considered idle.
- **`hive-status.status.problems.enabled`** (Default: `true`)  
  Displays the count of problems (errors/warnings) in your current project.

For a full list of configuration options, refer to the extension’s settings in VS Code.

## Troubleshooting

- If the extension doesn't appear connected, ensure you've set your `hive-status.app.apiEndpoint` correctly.
- Make sure `hive-status.app.playerSecret` is set to a valid secret provided by your remote service.
- If you encounter any errors, check the VS Code console (View > Output > select "Log (Extension Host)") for detailed logs.

## Privacy & Security

- Privacy Mode can hide sensitive details about your files and workspaces.
- Communication is done over HTTPS if your endpoint supports it.

## Feedback & Support

If you have questions or need help:

- Check the issues page on the extension’s GitHub repository.
- File a new issue if you’ve encountered a bug or have a feature request.
