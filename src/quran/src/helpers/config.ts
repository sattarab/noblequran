export enum ConfigEnv {
  DEV = "development",
  STG = "staging",
  PRD = "production",
}

export const config = {
  env: process.env.NODE_ENV as ConfigEnv,
  mixpanelToken: process.env.REACT_APP_MIXPANEL_TOKEN as string,
  version: process.env.REACT_APP_VERSION as string,
}

