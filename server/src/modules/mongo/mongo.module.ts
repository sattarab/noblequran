import { DynamicModule, Global, Module, OnModuleDestroy, Provider } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { ModuleRef } from "@nestjs/core"
import * as Debug from "debug"
import { MongoClient } from "mongodb"

import { getClientToken, getDbToken } from "./mongo.util"
import { DEFAULT_MONGO_CLIENT_OPTIONS } from "./mongo.constants"
import configuration from "../common/config"

const debug = Debug( "noblequran:modules:mongo" )

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
        debug( "Mongo open connection" )
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

  onModuleDestroy() {
    const client = this.moduleRef.get<MongoClient>( getClientToken() )
    if( client?.isConnected() ) {
      client.close()
    }
  }
}
