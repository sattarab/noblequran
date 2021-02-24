import type { NestMiddleware } from "@nestjs/common"
import { Injectable, ServiceUnavailableException } from "@nestjs/common"
import type { NextFunction, Request, Response } from "express"
import { MongoClient } from "mongodb"

import { InjectClient } from "../../mongo/mongo.decorators"

@Injectable()
export class ServiceMiddleware implements NestMiddleware {
  // eslint-disable-next-line @typescript-eslint/ban-types
  constructor( @InjectClient() private readonly client: MongoClient ) {}

  use( req: Request, res: Response, next: NextFunction ): void {
    if( ! this.client.isConnected() ) {
      throw new ServiceUnavailableException()
    }

    return next()
  }
}
