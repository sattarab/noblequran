import { Logger } from "@nestjs/common"
import * as cluster from "cluster"

import { bootstrap } from "./main"

if( cluster.isMaster ) {
  if( ! process.env.PORT ) {
    console.error( "Port required" )
    process.exit( 1 )
  }

  const port = parseInt( process.env.PORT )
  const workerPortMap: { [ key: string ]: number } = {}

  if( ! port ) {
    console.error( "Port required" )
    process.exit( 1 )
  }

  const worker = cluster.fork( { "VCAP_APPLICATION": port } )
  workerPortMap[ worker.id ] = port

  cluster.on( "online", () => {
    const workerPort = workerPortMap[ worker.id ]
    Logger.log( `Worker ${ worker.id } on port ${ workerPort } is online.` )

  } )

  cluster.on( "exit", ( _, code ) => {
    const workerPort = workerPortMap[ worker.id ]
    Logger.log( `Worker ${ worker.id } on port ${ workerPort } has died.` )

    if( code != 0 ) {
      const replacementWorker = cluster.fork( { "VCAP_APP_PORT": workerPort } )
      workerPortMap[ replacementWorker.id ] = workerPort
    }
  } )
} else {
  bootstrap()
}
