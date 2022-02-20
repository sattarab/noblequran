export enum ConfigEnv {
  DEV = "development",
  PRD = "production",
}

export interface Environment {
  baseUrl: string
  env: ConfigEnv
  mongo: {
    db: string
    uri: string
  }
}
