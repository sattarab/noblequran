import * as Sentry from "@sentry/browser"
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

export const logError = ( error: Error, options?: ErrorOptions ): void => {
  Sentry.withScope( ( scope ) => {
    if( options?.extras ) {
      scope.setExtras( options.extras )
    }

    Sentry.captureException( error.message )
  } )
}
