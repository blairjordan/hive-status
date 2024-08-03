import lang from "./data/languages.json"

export const { KNOWN_EXTENSIONS, KNOWN_LANGUAGES } = lang as {
  KNOWN_EXTENSIONS: Record<string, { image: string }>
  KNOWN_LANGUAGES: Array<{ language: string; image: string }>
}

export const EMPTY = ""
export const FAKE_EMPTY = "\u200b\u200b"

export const CONFIG_KEYS = {
  Enabled: "enabled" as const,
  App: {
    Id: "app.id" as const,
    Name: "app.name" as const,
    PrivacyMode: "app.privacyMode.enable" as const,
    WhitelistEnabled: "app.whitelistEnabled" as const,
    whitelistIsBlacklist: "app.whitelistIsBlacklist" as const,
    Whitelist: "app.whitelist" as const
  } as const,
  Status: {
    Details: {
      Enabled: "status.details.enabled" as const,
      Idle: {
        Enabled: "status.details.idle.enabled" as const
      } as const,
      Text: {
        Idle: "status.details.text.idle" as const,
        Editing: "status.details.text.editing" as const,
        Viewing: "status.details.text.viewing" as const,
        NotInFile: "status.details.text.notInFile" as const,
        NoWorkspaceText: "status.details.text.noWorkSpaceText" as const,
        Debugging: "status.details.text.debugging" as const
      } as const
    } as const,
    State: {
      Enabled: "status.state.enabled" as const,
      Debugging: {
        Enabled: "status.state.debugging.enabled" as const
      } as const,
      Idle: {
        Enabled: "status.state.idle.enabled" as const
      } as const,
      Text: {
        Idle: "status.state.text.idle" as const,
        Editing: "status.state.text.editing" as const,
        Debugging: "status.state.text.debugging" as const,
        Viewing: "status.state.text.viewing" as const,
        NotInFile: "status.state.text.notInFile" as const,
        NoWorkspaceFound: "status.state.text.noWorkspaceFound" as const
      } as const
    } as const,
    Problems: {
      Enabled: "status.problems.enabled" as const,
      Text: "status.problems.text" as const,
      countedSeverities: "status.problems.countedSeverities" as const
    } as const,
    Idle: {
      Enabled: "status.idle.enabled" as const,
      Check: "status.idle.check" as const,
      DisconnectOnIdle: "status.idle.disconnectOnIdle" as const,
      ResetElapsedTime: "status.idle.resetElapsedTime" as const,
      Timeout: "status.idle.timeout" as const
    } as const,
    ShowElapsedTime: "status.showElapsedTime" as const,
    ResetElapsedTimePerFile: "status.resetElapsedTimePerFile" as const
  } as const,
  Ignore: {
    Workspaces: "ignore.workspaces" as const,
    WorkspacesText: "ignore.workspacesText" as const,
    Repositories: "ignore.repositories" as const,
    Organizations: "ignore.organizations" as const,
    GitHosts: "ignore.gitHosts" as const
  } as const,
  File: {
    Size: {
      HumanReadable: "file.size.humanReadable" as const,
      Standard: "file.size.standard" as const,
      Round: "file.size.round" as const,
      Spacer: "file.size.spacer" as const
    } as const
  } as const,
  Behaviour: {
    AdditionalFileMapping: "behaviour.additionalFileMapping" as const,
    SuppressNotifications: "behaviour.suppressNotifications" as const,
    PrioritizeLanguagesOverExtensions: "behaviour.prioritizeLanguagesOverExtensions" as const,
    StatusBarAlignment: "behaviour.statusBarAlignment" as const,
    Debug: "behaviour.debug" as const
  } as const
} as const
