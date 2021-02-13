import { HttpException, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import * as Sentry from "@sentry/node"
import { throttle } from "lodash"
import { MongoError } from "mongodb"

import { ConfigEnv } from "../config"

export class BaseHttpException extends HttpException {
  constructor( message: string, status = 500, options?: { internal: boolean } ) {
    super( options?.internal ? "Unknown Error" : message, status )
  }
}

export class MongoDbException extends BaseHttpException {
  constructor( mongoError: MongoError ) {
    super( `${ mongoError.message } (${ mongoError.code })`, 500, { internal: true } )
  }
}

export class ValidationException extends BaseHttpException {
  constructor( message: string ) {
    super( message, 422 )
  }
}

@Injectable()
export class ErrorService {
  constructor( readonly configService: ConfigService ) {
    const env = configService.get( "env" )
    Sentry.init( {
      dsn: "https://14d5a108fc91469692bf5ddb525582ef@o143298.ingest.sentry.io/1129851",
      enabled: env !== ConfigEnv.DEV,
      environment: env,
      release: configService.get( "version" ),
    } )
  }

  private logError = throttle( ( error ) => {
    Sentry.captureException( error )
  } )

  handleError( error: HttpException ) {
    this.logError( error )
  }
}
