import { Logger } from "@nestjs/common"
import cluster from "cluster"

if( cluster.isPrimary ) {
  const port = 4443
  const workerPortMap: { [ key: string ]: number } = {}
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
  require( "./main" )
}
