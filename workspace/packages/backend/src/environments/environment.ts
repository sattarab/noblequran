import { ConfigEnv, Environment } from "./types"

export const environment: Environment = {
  baseUrl: "https://local.noblequran.cloud",
  env: ConfigEnv.DEV,
  mongo: {
    db: "noblequran",
    uri: "mongodb://nq-prd:XtM3unPFqo8m@cluster0-shard-00-00-ws4cc.mongodb.net:27017,cluster0-shard-00-01-ws4cc.mongodb.net:27017,cluster0-shard-00-02-ws4cc.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true",
  },
}
