import { Inject } from "@nestjs/common"

import { getClientToken, getDbToken } from "./mongo.util"

export const InjectClient = ( connectionName?: string ): ( target: Record<string, string>, key: string | symbol, index?: number ) => void => Inject( getClientToken( connectionName ) )
export const InjectDb = ( connectionName?: string ): ( target: Record<string, string>, key: string | symbol, index?: number ) => void => Inject( getDbToken( connectionName ) )
