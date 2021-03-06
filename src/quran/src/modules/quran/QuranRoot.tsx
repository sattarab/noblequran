import styled from "@emotion/styled"
import type { Theme } from "@material-ui/core/styles"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import clsx from "clsx"
import React, { lazy, Suspense } from "react"
import { Route, Switch } from "react-router-dom"

import { HEADER_HEIGHT, RIGHT_DRAWER_WIDTH } from "../../components/Styles"
import { QHeader } from "./components/Header"
import { QLoader } from "./components/Loader"
import { QuranContextProvider, useQuranState } from "./components/QuranContext"
import { RightDrawer } from "./components/RightDrawer"

// lazy load components
const AboutPage = lazy( () => import( "./pages/AboutPage/AboutPage" ).then( ( module ) => ( { default: module.AboutPage } ) ) )
const HomePageRoot = lazy( () => import( "./pages/HomePage/HomePage" ).then( ( module ) => ( { default: module.HomePageRoot } ) ) )
const SurahPage = lazy( () => import( "./pages/SurahPage/SurahPage" ).then( ( module ) => ( { default: module.SurahPage } ) ) )

const QuranContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const QuranLoadingContainer = styled.div`
  align-items: center;
  display: flex;
  height: calc( 100vh - ${ HEADER_HEIGHT } );
  justify-content: center;
`

const useStyles = makeStyles( ( theme: Theme ) =>
  createStyles( {
    content: {
      flexGrow: 1,
      transition: theme.transitions.create( "margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      } ),
      marginRight: 0,
    },
    contentShift: {
      transition: theme.transitions.create( "margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      } ),
      marginRight: RIGHT_DRAWER_WIDTH,
    },
  } ),
)

const QuranLoading: React.FunctionComponent = () => {
  return (
    <QuranLoadingContainer>
      <QLoader />
    </QuranLoadingContainer>
  )
}

export const QuranContainer: React.FunctionComponent = () => {
  const classes = useStyles()
  const { isMobileDevice, isRightDrawerOpen } = useQuranState()

  return (
    <QuranContainerWrapper>
      <QHeader />
      <main className={ clsx( classes.content, { [ classes.contentShift ]: isRightDrawerOpen && ! isMobileDevice } ) }>
        <Suspense fallback={ <QuranLoading /> }>
          <Switch>
            <Route exact path="/" component={ HomePageRoot } />
            <Route path="/about" component={ AboutPage } />
            <Route path="/:id" component={ SurahPage } />
          </Switch>
        </Suspense>
      </main>
      <RightDrawer />
    </QuranContainerWrapper>
  )
}

export const QuranRoot: React.FunctionComponent = () => {
  return (
    <QuranContextProvider>
      <QuranContainer />
    </QuranContextProvider>
  )
}
