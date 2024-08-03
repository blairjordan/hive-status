import { activity, onDiagnosticsChange } from "./activity"
import { throttle } from "./helpers/throttle"
import { logError, logInfo } from "./logger"
import { CONFIG_KEYS } from "./constants"
import { getConfig } from "./config"
import { dataClass } from "./data"
import { Disposable, WindowState, debug, languages, window, workspace } from "vscode"
import { editor } from "./editor"
import * as http from "http"

export class StatusController {
  listeners: Disposable[] = []
  enabled = true
  canSendActivity = true
  state: any = {}
  debug = false
  private endpoint: string

  private idleTimeout: NodeJS.Timeout | undefined
  private iconTimeout: NodeJS.Timeout | undefined
  private activityThrottle = throttle(
    (isViewing?: boolean, isIdling?: boolean) => this.sendActivity(isViewing, isIdling),
    2000,
    true
  )

  constructor(endpoint: string, debug = false) {
    this.endpoint = endpoint
    this.debug = debug

    editor.statusBarItem.text = "$(pulse) Connecting to Status Service..."
    editor.statusBarItem.command = undefined

    this.listen()
    editor.statusBarItem.text = "$(globe) Connected to Status Service"
    editor.statusBarItem.tooltip = "Click to disconnect from Status Service"
    editor.statusBarItem.command = "vshive.disconnect"
    editor.statusBarItem.show()
  }

  private listen() {
    const config = getConfig()

    const sendActivity = (isViewing = false, isIdling = false) => {
      this.activityThrottle.reset()
      void this.sendActivity(isViewing, isIdling)
    }

    const fileSwitch = window.onDidChangeActiveTextEditor(() => sendActivity(true))
    const fileEdit = workspace.onDidChangeTextDocument((e) => {
      if (e.document !== dataClass.editor?.document) return
      void this.activityThrottle.callable()
    })
    const fileSelectionChanged = window.onDidChangeTextEditorSelection((e) => {
      if (e.textEditor !== dataClass.editor) return
      void this.activityThrottle.callable()
    })
    const debugStart = debug.onDidStartDebugSession(() => sendActivity())
    const debugEnd = debug.onDidTerminateDebugSession(() => sendActivity())
    const diagnosticsChange = languages.onDidChangeDiagnostics(() => onDiagnosticsChange())
    const changeWindowState = window.onDidChangeWindowState((e: WindowState) => this.checkIdle(e))
    const gitListener = dataClass.onUpdate(() => this.activityThrottle.callable())

    if (config.get(CONFIG_KEYS.Status.Problems.Enabled)) this.listeners.push(diagnosticsChange)
    if (config.get(CONFIG_KEYS.Status.Idle.Check)) this.listeners.push(changeWindowState)

    this.listeners.push(fileSwitch, fileEdit, fileSelectionChanged, debugStart, debugEnd, gitListener)
  }

  private async checkIdle(windowState: WindowState) {
    if (!this.enabled) return

    const config = getConfig()

    if (config.get(CONFIG_KEYS.Status.Idle.Timeout) !== 0) {
      if (windowState.focused && this.idleTimeout) {
        clearTimeout(this.idleTimeout)
        await this.sendActivity()
      } else if (config.get(CONFIG_KEYS.Status.Idle.Check)) {
        this.idleTimeout = setTimeout(async () => {
          if (!config.get(CONFIG_KEYS.Status.Idle.Check)) return

          if (config.get(CONFIG_KEYS.Status.Idle.DisconnectOnIdle)) {
            await this.disable()
            if (config.get(CONFIG_KEYS.Status.Idle.ResetElapsedTime)) this.state.startTimestamp = undefined
            return
          }

          if (!this.enabled) return

          this.activityThrottle.reset()
          await this.sendActivity(false, true)
        }, config.get(CONFIG_KEYS.Status.Idle.Timeout)! * 1000)
      }
    }
  }

  async sendActivity(isViewing = false, isIdling = false): Promise<void> {
    if (!this.enabled) return
    this.state = await activity(this.state, isViewing, isIdling)
    this.state.instance = true
    if (!this.state || Object.keys(this.state).length === 0 || !this.canSendActivity) return

    try {
      const data = JSON.stringify(this.state)
      console.log("Sending activity data:", data)

      const options = {
        hostname: new URL(this.endpoint).hostname,
        port: new URL(this.endpoint).port || 443,
        path: new URL(this.endpoint).pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": data.length
        }
      }

      console.log("Request options:", options)

      const req = http.request(options, (res) => {
        let responseData = ""

        res.on("data", (chunk) => {
          responseData += chunk
        })

        res.on("end", () => {
          console.log("Response data:", responseData)
          if (res.statusCode !== 200) {
            console.error(`Failed to send activity: ${res.statusCode} ${res.statusMessage}`)
            throw new Error(`Failed to send activity: ${res.statusCode} ${res.statusMessage}`)
          }
          logInfo("Activity sent to status service:", this.state)
        })
      })

      req.on("error", (error) => {
        console.error("Request error:", error)
        logError("Error sending activity to status service:", error)
      })

      req.write(data)
      req.end()
    } catch (error) {
      console.error("Error in sendActivity:", error)
      logError("Error sending activity to status service:", error)
    }
  }

  async disable() {
    this.enabled = false

    this.cleanUp()
    if (this.idleTimeout) clearTimeout(this.idleTimeout)
    if (this.iconTimeout) clearTimeout(this.iconTimeout)

    try {
      const data = JSON.stringify({ clearActivity: true })

      const options = {
        hostname: new URL(this.endpoint).hostname,
        port: new URL(this.endpoint).port || 443,
        path: new URL(this.endpoint).pathname,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": data.length
        }
      }

      console.log("Sending disable data:", data)

      const req = http.request(options, (res) => {
        if (res.statusCode !== 200) {
          console.error(`Failed to clear activity: ${res.statusCode} ${res.statusMessage}`)
          throw new Error(`Failed to clear activity: ${res.statusCode} ${res.statusMessage}`)
        }
      })

      req.on("error", (error) => {
        console.error("Request error:", error)
        logError("Error clearing activity on status service:", error)
      })

      req.write(data)
      req.end()
    } catch (error) {
      console.error("Error in disable:", error)
      logError("Error clearing activity on status service:", error)
    }
  }

  async enable() {
    logInfo("[004] Debug:", "Enabling Status Service")

    this.enabled = true

    await this.sendActivity()
    this.cleanUp()
    this.listen()

    if (this.iconTimeout) clearTimeout(this.iconTimeout)
    this.iconTimeout = setTimeout(() => (editor.statusBarItem.text = "$(smiley)"), 5000)
  }

  cleanUp() {
    for (const listener of this.listeners) listener.dispose()
    this.listeners = []
  }

  async destroy() {
    await this.disable()
  }
}
