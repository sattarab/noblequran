import { NestFactory } from "@nestjs/core"
import * as fs from "fs"
import * as path from "path"

import { AppModule } from "./app.module"

async function bootstrap() {
  let sslFolderPath: string

  if( ! __dirname.startsWith( "/var/www/noblequran/app" ) ) {
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

  await app.listen( 4443 )
}

bootstrap()
