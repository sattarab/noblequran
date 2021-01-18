import { HttpException, Injectable } from "@nestjs/common"
import { MongoError } from "mongodb"

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
  handleError( error: HttpException ) {
    console.info( error )
  }
}