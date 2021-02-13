export enum ConfigEnv {
  DEV = "dev",
  STG = "stg",
  PRD = "prd",
}

export const config = {
  env: process.env.REACT_APP_ENV as ConfigEnv,
  version: process.env.REACT_APP_VERSION as string,
}
