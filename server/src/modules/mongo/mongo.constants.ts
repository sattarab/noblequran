import { MongoClientOptions } from "mongodb"

export const DEFAULT_MONGO_CLIENT_OPTIONS: MongoClientOptions = { useNewUrlParser: true, useUnifiedTopology: true }
export const DEFAULT_MONGO_CONNECTION_NAME = "MongoConnection"