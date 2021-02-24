import { Inject } from "@nestjs/common"

import { getClientToken, getDbToken } from "./mongo.util"

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const InjectClient = ( connectionName?: string ) => Inject( getClientToken( connectionName ) )

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const InjectDb = ( connectionName?: string ) => Inject( getDbToken( connectionName ) )
