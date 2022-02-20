import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"
import { APP_FILTER } from "@nestjs/core"

import { MongoModule } from "../mongo/mongo.module"
import { HttpExceptionFilter } from "./filters/http-exception.filter"
import { ErrorService } from "./helpers/error.helper"

@Module( {
  exports: [
    ErrorService,
  ],
  imports: [
    ConfigModule.forRoot(),
    MongoModule.forRoot(),
  ],
  providers: [
    ErrorService,
    {
      // Add global exception filter for the app
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
} )
export class CommonModule {}
