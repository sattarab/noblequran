import { Inject } from "@nestjs/common"

import { getClientToken, getDbToken } from "./mongo.util"

export const InjectClient = ( connectionName?: string ) => Inject( getClientToken( connectionName ) )

export const InjectDb = ( connectionName?: string ) => Inject( getDbToken( connectionName ) )