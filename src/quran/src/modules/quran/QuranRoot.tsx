import React from "react"
import { Route, Switch } from "react-router-dom"

import { QHeader } from "./components/Header"
import { QuranContextProvider } from "./components/QuranContext"
import { AboutPage } from "./pages/AboutPage/AboutPage"
import { HomePage } from "./pages/HomePage/HomePage"
import { SurahPage } from "./pages/SurahPage/SurahPage"

export const QuranRoot: React.FunctionComponent = () => {
  return (
    <QuranContextProvider>
      <QHeader />
      <Switch>
        <Route exact path="/" component={ HomePage } />
        <Route path="/about" component={ AboutPage } />
        <Route path="/:id" component={ SurahPage } />
      </Switch>
    </QuranContextProvider>
  )
}
