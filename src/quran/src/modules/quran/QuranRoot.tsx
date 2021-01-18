import { createBrowserHistory } from "history"
import React from "react"
import { Router, Route } from "react-router-dom"

import { Header } from "./components/Header"
import { Home } from "./components/Home"

const history = createBrowserHistory()

export const QuranRoot: React.FunctionComponent = () => (
  <>
    <Header />
    <Router history={ history }>
      <Route path="/">
        <Home />
      </Route>
    </Router>
  </>
)