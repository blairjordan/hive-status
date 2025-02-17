import "source-map-support/register"
import { commands, window, workspace, ExtensionContext } from "vscode"
import { getConfig } from "./config"
import { editor } from "./editor"
import { StatusController } from "./controller"
import { CONFIG_KEYS } from "./constants"

let controller: StatusController

export const registerListeners = (ctx: ExtensionContext) => {
  console.log("Registering listeners")
  const onConfigurationChanged = workspace.onDidChangeConfiguration(async (e) => {
    console.log("Configuration changed")
    const config = getConfig()

    if (e.affectsConfiguration(CONFIG_KEYS.App.ApiEndpoint)) {
      const newEndpoint = config.get(CONFIG_KEYS.App.ApiEndpoint) as string
      controller.updateEndpoint(newEndpoint)
    }

    const isEnabled = config.get(CONFIG_KEYS.Enabled)

    editor.updateStatusBarFromConfig()

    if (isEnabled) {
      await controller.enable()
    } else {
      await controller.disable()
    }
  })

  ctx.subscriptions.push(onConfigurationChanged)
}

export const registerCommands = (ctx: ExtensionContext) => {
  console.log("Registering commands")
  const config = getConfig()

  const enable = async (update = true) => {
    console.log("Enabling extension")
    if (update) {
      try {
        await config.update(CONFIG_KEYS.Enabled, true)
      } catch (error) {
        console.error("Failed to update configuration:", error)
      }
    }

    await controller.enable()
  }

  const disable = async (update = true) => {
    console.log("Disabling extension")
    if (update) {
      try {
        await config.update(CONFIG_KEYS.Enabled, false)
      } catch (error) {
        console.error("Failed to update configuration:", error)
      }
    }

    await controller.disable()
  }

  const togglePrivacyMode = async (activate: boolean) => {
    console.log(`Toggling privacy mode to ${activate}`)
    try {
      await config.update(CONFIG_KEYS.App.PrivacyMode, activate)
    } catch (error) {
      console.error("Failed to update privacy mode:", error)
    }

    await controller.sendActivity()
  }

  const enableCommand = commands.registerCommand("hive-status.enable", async () => {
    console.log("Command: hive-status.enable")
    await disable(false)
    await enable(false)

    console.log("Enabled Virtual Office Status.")

    if (!config.get(CONFIG_KEYS.Behaviour.SuppressNotifications)) {
      await window.showInformationMessage("Enabled Virtual Office Status")
    }
  })

  const disableCommand = commands.registerCommand("hive-status.disable", async () => {
    console.log("Command: hive-status.disable")
    console.log("Disabled Virtual Office Status")

    await disable(false)

    if (!config.get(CONFIG_KEYS.Behaviour.SuppressNotifications)) {
      await window.showInformationMessage("Disabled Virtual Office Status")
    }
  })

  const enableWorkspaceCommand = commands.registerCommand("hive-status.workspace.enable", async () => {
    console.log("Command: hive-status.workspace.enable")
    console.log("Enabled Virtual Office Status")

    await disable()
    await enable()

    if (!config.get(CONFIG_KEYS.Behaviour.SuppressNotifications)) {
      await window.showInformationMessage("Enabled Virtual Office Status for this workspace")
    }
  })

  const disableWorkspaceCommand = commands.registerCommand("hive-status.workspace.disable", async () => {
    console.log("Command: hive-status.workspace.disable")
    console.log("Disabled Virtual Office Status")

    await disable()

    if (!config.get(CONFIG_KEYS.Behaviour.SuppressNotifications)) {
      await window.showInformationMessage("Disabled Virtual Office Status for this workspace")
    }
  })

  const enablePrivacyModeCommand = commands.registerCommand("hive-status.enablePrivacyMode", async () => {
    console.log("Command: hive-status.enablePrivacyMode")
    console.log("Enabled Privacy Mode")

    await togglePrivacyMode(true)

    if (!config.get(CONFIG_KEYS.Behaviour.SuppressNotifications)) {
      await window.showInformationMessage("Enabled Privacy Mode.")
    }
  })

  const disablePrivacyModeCommand = commands.registerCommand("hive-status.disablePrivacyMode", async () => {
    console.log("Command: hive-status.disablePrivacyMode")
    console.log("Disabled Privacy Mode")

    await togglePrivacyMode(false)

    if (!config.get(CONFIG_KEYS.Behaviour.SuppressNotifications)) {
      await window.showInformationMessage("Disabled Privacy Mode.")
    }
  })

  const setPlayerSecretCommand = commands.registerCommand("hive-status.setPlayerSecret", async () => {
    const playerSecret = await window.showInputBox({ prompt: "Enter your player secret key" })
    if (playerSecret) {
      await getConfig().update(CONFIG_KEYS.App.PlayerSecret, playerSecret)
      window.showInformationMessage("Player secret key updated!")
    }
  })

  ctx.subscriptions.push(
    enableCommand,
    disableCommand,
    enableWorkspaceCommand,
    disableWorkspaceCommand,
    enablePrivacyModeCommand,
    disablePrivacyModeCommand,
    setPlayerSecretCommand
  )

  console.log("Registered Virtual Office Status commands")
}

export async function activate(ctx: ExtensionContext) {
  console.log("Virtual Office Status for VS Code activated.")

  const endpoint = (getConfig().get(CONFIG_KEYS.App.ApiEndpoint) as string) || "https://api.flurry.world/graphql"
  const debugMode = getConfig().get(CONFIG_KEYS.Behaviour.Debug)
  controller = new StatusController(endpoint, debugMode)

  console.log("StatusController created")

  registerCommands(ctx)
  registerListeners(ctx)

  if (getConfig().get(CONFIG_KEYS.Enabled)) {
    console.log("Extension is enabled in configuration")
    await controller.enable()
  }
}

export async function deactivate() {
  console.log("Virtual Office Status for VS Code deactivated.")
  await controller.destroy()
}
