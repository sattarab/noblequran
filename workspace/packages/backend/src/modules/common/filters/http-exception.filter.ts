import type { ArgumentsHost, ExceptionFilter } from "@nestjs/common"
import { Catch, HttpException } from "@nestjs/common"
import type { Response } from "express"

import { ErrorService } from "../helpers/error.helper"

@Catch( HttpException )
export class HttpExceptionFilter implements ExceptionFilter {
  constructor( readonly errorService: ErrorService ) {}

  catch( exception: HttpException, host: ArgumentsHost ): void {
    const context = host.switchToHttp()
    const response = context.getResponse<Response>()
    const status = exception.getStatus()

    this.errorService.handleError( exception )

    response
      .status( status )
      .json( {
        message: exception.message,
        statusCode: status,
      } )
  }
}
