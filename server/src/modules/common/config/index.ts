export enum ConfigEnv {
  DEV = "dev",
  STG = "stg",
  PRD = "prd",
}

const packages = {
  root: require( "../../../../package.json" ),
}

export default () => (  {
  env: process.env.NODE_ENV || ConfigEnv.DEV,
  mongo: {
    db: process.env.MONGO_DB || "noblequran",
    uri: process.env.MONGO_URI || "mongodb://nq-prd:XtM3unPFqo8m@cluster0-shard-00-00-ws4cc.mongodb.net:27017,cluster0-shard-00-01-ws4cc.mongodb.net:27017,cluster0-shard-00-02-ws4cc.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true",
  },
  version: packages.root.version,
} )
