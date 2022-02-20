import "./app/index.scss"

import * as Sentry from "@sentry/browser"
import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"

import App from "./app/App"
import store from "./app/store"
import { environment } from "./environments/environment"
import { ConfigEnv } from "./environments/types"

Sentry.init( {
  dsn: "https://d7c9918b26284a86a1d82a9e2815e4a2@o143298.ingest.sentry.io/5635147",
  enabled: environment.env !== ConfigEnv.DEV,
  environment: environment.env,
} )

ReactDOM.render(
  <React.StrictMode>
    <Provider store={ store }>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById( "root" ),
)
