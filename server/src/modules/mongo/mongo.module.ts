import type { DynamicModule, OnModuleDestroy, Provider } from "@nestjs/common"
import { Global, Logger, Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { ModuleRef } from "@nestjs/core"
import { MongoClient } from "mongodb"

import configuration from "../common/config"
import { DEFAULT_MONGO_CLIENT_OPTIONS } from "./mongo.constants"
import { getClientToken, getDbToken } from "./mongo.util"

@Global()
@Module( {
  imports: [ ConfigModule.forRoot( { load: [ configuration ] } ) ],
} )
export class MongoModule implements OnModuleDestroy {
  constructor( private readonly moduleRef: ModuleRef ) {}

  static forRoot(): DynamicModule {
    const clientProvider: Provider = {
      inject: [ ConfigService ],
      provide: getClientToken(),
      useFactory: async ( configService: ConfigService ) => {
        Logger.debug( "Mongo open connection" )
        const client = new MongoClient( configService.get<string>( "mongo.uri" ), DEFAULT_MONGO_CLIENT_OPTIONS )
        return await client.connect()
      },
    }

    const dbProvider: Provider = {
      inject: [ getClientToken(), ConfigService ],
      provide: getDbToken(),
      useFactory: ( client: MongoClient, configService: ConfigService ) => client.db( configService.get<string>( "mongo.db" ) ),
    }

    return {
      exports: [ clientProvider, dbProvider ],
      module: MongoModule,
      providers: [ clientProvider, dbProvider ],
    }
  }

  onModuleDestroy(): void {
    const client = this.moduleRef.get<MongoClient>( getClientToken() )
    if( client?.isConnected() ) {
      client.close()
    }
  }
}
