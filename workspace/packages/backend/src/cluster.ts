import { Logger } from "@nestjs/common"
import cluster from "cluster"
import * as os from "os"

if( cluster.isPrimary ) {
  if( ! process.env.PORT ) {
    console.error( "Port required" )
    process.exit( 1 )
  }

  let port = parseInt( process.env.PORT )
  const workerPortMap: { [ key: string ]: number } = {}

  if( ! port ) {
    console.error( "Port required" )
    process.exit( 1 )
  }

  for( let i = 0; i < os.cpus().length; i++ ) {
    console.log( "PORT", port )
    const worker = cluster.fork( { "VCAP_APPLICATION": port } )
    workerPortMap[ worker.id ] = port
    port += 1
  }

  cluster.on( "online", worker => {
    const workerPort = workerPortMap[ worker.id ]
    Logger.log( `Worker ${ worker.id } on port ${ workerPort } is online.` )

  } )

  cluster.on( "exit", ( worker, code ) => {
    const workerPort = workerPortMap[ worker.id ]
    Logger.log( `Worker ${ worker.id } on port ${ workerPort } has died.` )

    if( code != 0 ) {
      const replacementWorker = cluster.fork( { "VCAP_APP_PORT": workerPort } )
      workerPortMap[ replacementWorker.id ] = workerPort
    }
  } )
} else {
  require( "./main" )
}
