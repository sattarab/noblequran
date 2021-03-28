import { Logger } from "@nestjs/common"
import { NestFactory } from "@nestjs/core"
import * as fs from "fs"
import * as path from "path"

import { AppModule } from "./app.module"
import getConfig, { ConfigEnv } from "./modules/common/config"

export async function bootstrap(): Promise<void> {
  const config = getConfig()

  let sslFolderPath: string

  if( config.env === ConfigEnv.DEV && ! __dirname.startsWith( "/var/www/noblequran/app" ) ) {
    sslFolderPath = path.resolve( __dirname, "../../ops/haproxy/ssl" )
  } else {
    sslFolderPath = "/var/www/noblequran/ssl"
  }

  const sslKeyPath = path.resolve( sslFolderPath, "localhost.pem" )
  const sslCertPath = path.resolve( sslFolderPath, "localhost.crt" )

  if( ! fs.existsSync( sslKeyPath ) ) {
    throw new Error( "SSL key not found" )
  }

  if( ! fs.existsSync( sslCertPath ) ) {
    throw new Error( "SSL key not found" )
  }

  const app = await NestFactory.create( AppModule, {
    httpsOptions: {
      cert: fs.readFileSync( sslCertPath ),
      key: fs.readFileSync( sslKeyPath ),
    },
  } )

  const port = process.env.VCAP_APPLICATION || process.env.PORT || 4443
  await app.listen( port )
  Logger.log( `Express server started on ${ port }` )
}

bootstrap()
