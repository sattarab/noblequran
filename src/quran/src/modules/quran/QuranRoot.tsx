import React from "react"
import { Route, Switch } from "react-router-dom"

import { AboutPage } from "./pages/AboutPage/AboutPage"
import { Header } from "./components/Header"
import { HomePage } from "./pages/HomePage/HomePage"
import { SurahPage } from "./pages/SurahPage/SurahPage"

export const QuranRoot: React.FunctionComponent = () => {
  return (
    <>
      <Header />
      <Switch>
        <Route exact path="/" component={ HomePage } />
        <Route path="/about" component={ AboutPage } />
        <Route path="/:id" component={ SurahPage } />
      </Switch>
    </>
  )
}
