import { MiddlewareConsumer, Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

import configuration from "./modules/common/config"
import { ServiceMiddleware } from "./modules/common/middleware/service.middleware"
import { MongoModule } from "./modules/mongo/mongo.module"
import { QuranModule } from "./modules/quran/quran.module"

@Module( {
  imports: [
    ConfigModule.forRoot( { load: [ configuration ] } ),
    MongoModule.forRoot(),
    QuranModule,
  ],
} )
export class AppModule {
  configure( consumer: MiddlewareConsumer ) {
    consumer
      .apply( ServiceMiddleware )
      .forRoutes( "*" )
  }
}
