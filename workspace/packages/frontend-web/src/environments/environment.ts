// This file can be replaced during build by using the `fileReplacements` array.
// When building for production, this file is replaced with `environment.prod.ts`.

import { ConfigEnv, Environment } from "./types"

export const environment: Environment = {
  env: ConfigEnv.DEV,
  mixpanelToken: "61f10bb6350769f80a6c76560286815a",
}
