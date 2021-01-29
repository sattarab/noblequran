import { Injectable, NestMiddleware, ServiceUnavailableException } from "@nestjs/common"
import { NextFunction, Request, Response } from "express"
import { MongoClient } from "mongodb"

import { InjectClient } from "../../mongo/mongo.decorators"

@Injectable()
export class ServiceMiddleware implements NestMiddleware {
  constructor( @InjectClient() private readonly client: MongoClient ) {}

  use( req: Request, res: Response, next: NextFunction ) {
    if( ! this.client.isConnected() ) {
      throw new ServiceUnavailableException()
    }

    return next()
  }
}
