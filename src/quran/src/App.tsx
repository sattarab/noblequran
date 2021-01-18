import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles"
import React from "react"

import "./App.scss"
import { QuranRoot } from "./modules/quran/QuranRoot"

const theme = createMuiTheme( {
  palette: {
    primary: {
      main: "#4b4b4b",
    },
  },
  typography: {
    fontFamily: "GothamRounded",
    fontWeightBold: 700,
    fontWeightLight: 300,
    fontWeightMedium: 500,
    fontWeightRegular: 400,
  } } )

function App() {
  return (
    <ThemeProvider theme={ theme }>
      <QuranRoot />
    </ThemeProvider>
  )
}

export default App
