/* eslint-disable @typescript-eslint/no-explicit-any */
import { workspace, type ConfigurationTarget, type WorkspaceConfiguration } from "vscode"
import { type PROBLEM_LEVEL } from "./activity"

export type FileSizeStandard = "iec" | "jedec"

export interface ExtensionConfigurationType {
  "app.id": string
  "app.name": "Code" | "Visual Studio Code" | "VSCodium" | "Custom"
  "app.privacyMode.enable": boolean
  "app.whitelistEnabled": boolean
  "app.whitelistIsBlacklist": boolean
  "app.whitelist": string[]
  "status.details.enabled": boolean
  "status.details.idle.enabled": boolean
  "status.details.text.idle": string
  "status.details.text.viewing": string
  "status.details.text.editing": string
  "status.details.text.debugging": string
  "status.details.text.notInFile": string
  "status.details.text.noWorkSpaceText": string
  "status.state.enabled": boolean
  "status.state.debugging.enabled": boolean
  "status.state.idle.enabled": boolean
  "status.state.text.idle": string
  "status.state.text.viewing": string
  "status.state.text.editing": string
  "status.state.text.debugging": string
  "status.state.text.notInFile": string
  "status.state.text.noWorkspaceFound": string
  "status.problems.enabled": boolean
  "status.problems.text": string
  "status.problems.countedSeverities": Array<PROBLEM_LEVEL>
  "status.idle.enabled": boolean
  "status.idle.check": boolean
  "status.idle.disconnectOnIdle": boolean
  "status.idle.resetElapsedTime": boolean
  "status.idle.timeout": number
  "status.showElapsedTime": boolean
  "status.resetElapsedTimePerFile": boolean
  "ignore.workspaces": Array<string>
  "ignore.workspacesText": string | Record<string, string>
  "ignore.repositories": Array<string>
  "ignore.organizations": Array<string>
  "ignore.gitHosts": Array<string>
  "file.size.humanReadable": boolean
  "file.size.standard": FileSizeStandard
  "file.size.round": number
  "file.size.spacer": string
  "behaviour.additionalFileMapping": Record<string, string>
  "behaviour.suppressNotifications": boolean
  "behaviour.prioritizeLanguagesOverExtensions": boolean
  "behaviour.statusBarAlignment": "Left" | "Right"
  "behaviour.debug": boolean
}

export type WorkspaceConfigurationWithType<Configuration extends Record<string, any>> = {
  get<T, S extends keyof Configuration | (string & Record<never, never>)>(
    section: S
  ): (S extends keyof Configuration ? Configuration[S] : T) | undefined

  get<
    T,
    S extends keyof Configuration | (string & Record<never, never>),
    R = S extends keyof Configuration ? Configuration[S] : T
  >(
    section: S,
    defaultValue: R
  ): R

  has<S extends keyof Configuration | (string & Record<never, never>)>(section: S): boolean

  inspect<
    T,
    S extends keyof Configuration | (string & Record<never, never>),
    R = S extends keyof Configuration ? Configuration[S] : T
  >(
    section: S
  ):
    | {
        key: S
        defaultValue?: R
        globalValue?: R
        workspaceValue?: R
        workspaceFolderValue?: R
        defaultLanguageValue?: R
        globalLanguageValue?: R
        workspaceLanguageValue?: R
        workspaceFolderLanguageValue?: R
        languageIds?: string[]
      }
    | undefined

  update<S extends keyof Configuration | (string & Record<never, never>)>(
    section: S,
    value: S extends keyof Configuration ? Configuration[S] : unknown,
    configurationTarget?: ConfigurationTarget | boolean | null,
    overrideInLanguage?: boolean
  ): Thenable<void>

  readonly [key: string]: any
} & WorkspaceConfiguration

export type ExtensionConfiguration = WorkspaceConfigurationWithType<ExtensionConfigurationType>

export const getConfig = () => workspace.getConfiguration("vshive") as ExtensionConfiguration
