import "./App.scss"

import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles"
import React from "react"
import { BrowserRouter as Router } from "react-router-dom"

import { BASE_FONT_FAMILY, BLUE_COLOR, DEFAULT_TEXT_COLOR } from "./components/Styles"
import { QuranRoot } from "./modules/quran/QuranRoot"

const theme = createMuiTheme( {
  palette: {
    primary: {
      main: DEFAULT_TEXT_COLOR,
    },
    secondary: {
      main: BLUE_COLOR,
    },
  },
  typography: {
    fontFamily: BASE_FONT_FAMILY,
    fontWeightBold: 700,
    fontWeightLight: 300,
    fontWeightMedium: 500,
    fontWeightRegular: 400,
  },
} )

function App(): JSX.Element {
  return (
    <Router>
      <ThemeProvider theme={ theme }>
        <QuranRoot />
      </ThemeProvider>
    </Router>
  )
}

export default App
