import * as Sentry from "@sentry/browser"

import { config, ConfigEnv } from "./config"

Sentry.init( {
  dsn: "https://d7c9918b26284a86a1d82a9e2815e4a2@o143298.ingest.sentry.io/5635147",
  environment: config.env,
  enabled: true,
  release: "0.0.0-1",
} )

export interface ErrorOptions {
  /** Added to extra on error in Sentry  */
  extras?: { [ key: string ]: string | boolean }
}

export enum ErrorType {
  HTTP = "http",
}

export class ErrorBase extends Error {
  public options: ErrorOptions
  public type: ErrorType

  constructor( type: ErrorType, message: string, options?: ErrorOptions ) {
    super( message )
    this.type = type
    this.options = options || {}
  }
}

export interface HttpErrorOptions extends ErrorOptions {
  statusCode: number
}

export class HttpError extends ErrorBase {
  private statusCode: number

  constructor( message: string, options: HttpErrorOptions ) {
    super( ErrorType.HTTP, message, options )
    this.statusCode = options.statusCode
  }
}

export const logError = ( error: Error, options?: ErrorOptions ) => {
  Sentry.captureException( error.message )
}
