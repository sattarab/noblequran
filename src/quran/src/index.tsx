import "./index.scss"

import * as Sentry from "@sentry/browser"
import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"

import App from "./App"
import { config, ConfigEnv } from "./helpers/config"
import reportWebVitals from "./reportWebVitals"
import store from "./store"

Sentry.init( {
  dsn: "https://d7c9918b26284a86a1d82a9e2815e4a2@o143298.ingest.sentry.io/5635147",
  enabled: config.env !== ConfigEnv.DEV,
  environment: config.env,
  release: config.version,
} )

ReactDOM.render(
  <React.StrictMode>
    <Provider store={ store }>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById( "root" ),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
