import Drawer from "@material-ui/core/Drawer"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import clsx from "clsx"
import React, { useCallback } from "react"
import { Route, Switch } from "react-router-dom"

import { ClearIcon } from "../../components/Icon"
import { BORDER_COLOR, DEFAULT_TEXT_COLOR, HEADER_HEIGHT } from "../../components/Styles"
import { QHeader } from "./components/Header"
import { QuranContextProvider, useQuranState } from "./components/QuranContext"
import { AboutPage } from "./pages/AboutPage/AboutPage"
import { HomePage } from "./pages/HomePage/HomePage"
import { SurahPage } from "./pages/SurahPage/SurahPage"

const RIGHT_DRAWER_WIDTH = 320

const useStyles = makeStyles( ( theme: Theme ) =>
  createStyles( {
    root: {
      display: "flex",
      flexDirection: "column",
    },
    header: {
      transition: theme.transitions.create( [ "margin", "width" ], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      } ),
      marginRight: 0,
    },
    headerShift: {
      transition: theme.transitions.create( [ "margin", "width" ], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      } ),
      marginRight: RIGHT_DRAWER_WIDTH,
      width: `calc( 100% - ${ RIGHT_DRAWER_WIDTH }px )`,
    },
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
    drawer: {
      flexShrink: 0,
      width: RIGHT_DRAWER_WIDTH,
    },
    drawerCloseIcon: {
      cursor: "pointer",
      fill: DEFAULT_TEXT_COLOR,
    },
    drawerHeaderContainer: {
      alignItems: "center",
      borderBottom: `1px solid ${ BORDER_COLOR }`,
      display: "flex",
      fontWeight: 500,
      height: `calc( ${ HEADER_HEIGHT } - 1px )`,
      padding: "0 15px",
    },
    drawerHeaderTitle: {
      flex: 1,
      fontWeight: 500,
    },
    drawerPaper: {
      width: RIGHT_DRAWER_WIDTH,
    },
  } ),
)

export const QuranContainer: React.FunctionComponent = () => {
  const classes = useStyles()
  const { isMobileDevice, isRightDrawerOpen, setIsRightDrawerOpen } = useQuranState()

  const closeRightDrawer = useCallback( () => {
    setIsRightDrawerOpen( false )
  }, [] )

  return (
    <div className={ classes.root }>
      <QHeader className={ clsx( classes.header, {
        [classes.headerShift]: isRightDrawerOpen && ! isMobileDevice,
      } ) } />
      <main className={ clsx( classes.content, {
        [classes.contentShift]: isRightDrawerOpen && ! isMobileDevice,
      } ) }>
        <Switch>
          <Route exact path="/" component={ HomePage } />
          <Route path="/about" component={ AboutPage } />
          <Route path="/:id" component={ SurahPage } />
        </Switch>
      </main>
      <Drawer
        anchor="right"
        className={ classes.drawer }
        classes={ {
          paper: classes.drawerPaper,
        } }
        open={ isRightDrawerOpen }
        variant="persistent"
      >
        <div className={ classes.drawerHeaderContainer }>
          <div className={ classes.drawerHeaderTitle }>Selected Verses</div>
          <ClearIcon className={ classes.drawerCloseIcon } onClick={ closeRightDrawer } />
        </div>
      </Drawer>
    </div>
  )
}

export const QuranRoot: React.FunctionComponent = () => {
  return (
    <QuranContextProvider>
      <QuranContainer />
    </QuranContextProvider>
  )
}
