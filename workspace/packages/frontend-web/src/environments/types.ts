export enum ConfigEnv {
  DEV = "development",
  STG = "staging",
  PRD = "production",
}

export interface Environment {
  env: ConfigEnv
  mixpanelToken: string
}
