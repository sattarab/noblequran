import { DEFAULT_MONGO_CONNECTION_NAME } from "./mongo.constants"

export function getClientToken( connectionName: string = DEFAULT_MONGO_CONNECTION_NAME ): string {
  return `${ connectionName }Client`
}

export function getDbToken( connectionName: string = DEFAULT_MONGO_CONNECTION_NAME ): string {
  return `${ connectionName }Db`
}