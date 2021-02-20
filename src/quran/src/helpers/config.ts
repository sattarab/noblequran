export enum ConfigEnv {
  DEV = "development",
  STG = "staging",
  PRD = "production",
}

export const config = {
  env: process.env.NODE_ENV as ConfigEnv,
  version: process.env.REACT_APP_VERSION as string,
}

console.log( "config.env", config.env )
