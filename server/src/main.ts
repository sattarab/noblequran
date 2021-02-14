import { NestFactory } from "@nestjs/core"
import * as fs from "fs"
import * as path from "path"

import { AppModule } from "./app.module"

async function bootstrap() {
  let ssl_folder_path: string

  if( ! __dirname.startsWith( "/var/www/noblequra/app" ) ) {
    ssl_folder_path = path.resolve( __dirname, "../../ops/haproxy/ssl" )
  }

  console.log( "ssl_folder_path", ssl_folder_path )

  const ssl_key_path = path.resolve( ssl_folder_path, "localhost.pem" )
  const ssl_cert_path = path.resolve( ssl_folder_path, "localhost.crt" )

  if( ! fs.existsSync( ssl_key_path ) ) {
    throw new Error( "SSL key not found" )
  }

  if( ! fs.existsSync( ssl_cert_path ) ) {
    throw new Error( "SSL key not found" )
  }

  const app = await NestFactory.create( AppModule, {
    httpsOptions: {
      cert: fs.readFileSync( ssl_cert_path ),
      key: fs.readFileSync( ssl_key_path ),
    },
  } )
  await app.listen( 4443 )
}
bootstrap()
