import Accordion from "@material-ui/core/Accordion"
import AccordionDetails from "@material-ui/core/AccordionDetails"
import AccordionSummary from "@material-ui/core/AccordionSummary"
import Drawer from "@material-ui/core/Drawer"
import IconButton from "@material-ui/core/IconButton"
import type { Theme } from "@material-ui/core/styles"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import clsx from "clsx"
import React, { useCallback } from "react"
import { Route, Switch } from "react-router-dom"
import styled from "styled-components"

import { ClearIcon, KeyboardArrowDownIcon, RemoveIcon } from "../../components/Icon"
import { BLUE_COLOR, BORDER_COLOR, DARKER_TEXT_COLOR, DEFAULT_TEXT_COLOR, HEADER_HEIGHT } from "../../components/Styles"
import { QHeader } from "./components/Header"
import { QuranContextProvider, useQuranState } from "./components/QuranContext"
import { AboutPage } from "./pages/AboutPage/AboutPage"
import { HomePage } from "./pages/HomePage/HomePage"
import { SurahPage } from "./pages/SurahPage/SurahPage"

const RIGHT_DRAWER_WIDTH = 320

const QuranContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const RightDrawerBodyReviewContainer = styled.div`
  border-bottom: 1px solid ${ BORDER_COLOR };
  max-height: 50%;
  overflow-y: scroll;
  padding: 15px 15px;
`

const RightDrawerBodyReviewTitle = styled.div`
  color: ${ DARKER_TEXT_COLOR };
  font-size: 15px;
  font-weight: 500;
  letter-spacing: 0.25px;
`

const RightDrawerHeaderContainer = styled.div`
  align-items: center;
  border-bottom: 1px solid ${ BORDER_COLOR };
  display: flex;
  height: calc( ${ HEADER_HEIGHT } - 1px );
  padding: 0 15px;
`

const RightDrawerHeaderTitle = styled.div`
  color: ${ DARKER_TEXT_COLOR };
  flex: 1;
  font-weight: 700;
  letter-spacing: 0.1px;
`

const RightDrawerPlaceholderContainer = styled.div`
  align-items: center;
  display: flex;
  height: calc( 100% - ${ HEADER_HEIGHT } );
  padding: 0 15px;
`

const RightDrawerPlaceholderText = styled.div`
  color: ${ DARKER_TEXT_COLOR };
  font-weight: 500;
  text-align: center;
  width: 100%;
`

const RightDrawerSurahContainer = styled( Accordion )`
  border: 1px solid ${ BORDER_COLOR };

  & + & {
    margin-top: 10px;
  }
`

const RightDrawerSurahTitle = styled.h2`
  color: ${ BLUE_COLOR };
  flex: 1;
  font-size: 16px;
  font-weight: 500;
  margin: 0;
`

const RightDrawerSurahTitleContainer = styled( AccordionSummary )`
  align-items: center;
  cursor: pointer;
  display: flex;
`

const RightDrawerSurahVerseContainer = styled.div`
  align-items: center;
  display: flex;
`

const RightDrawerSurahVerseText = styled.div`
  color: ${ DARKER_TEXT_COLOR };
  flex: 1;
  font-size: 14px;
  padding: 12px 0;
`

const RightDrawerSurahVersesContainer = styled( AccordionDetails )`
  display: flex;
  flex-direction: column;
`

const RightDrawerSurahsContainer = styled.div`
  margin-top: 25px;
`

const useStyles = makeStyles( ( theme: Theme ) =>
  createStyles( {
    accordion: {
      boxShadow: "none",
      "&:before": {
        background: "none",
      },
    },
    clickableSvgIcon: {
      cursor: "pointer",
      fill: DEFAULT_TEXT_COLOR,
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
    },
    drawerPaper: {
      background: "#ffffff",
      boxShadow: "0px 1px 2px 0px rgba( 60, 64, 67, 0.3 ), 0px 2px 6px 2px rgba( 60, 64, 67, 0.15 )",
      width: RIGHT_DRAWER_WIDTH,
    },
  } ),
)

export const QuranContainer: React.FunctionComponent = () => {
  const classes = useStyles()
  const { baseClasses, isMobileDevice, isRightDrawerOpen, selectedAyahs, setIsRightDrawerOpen, surahs } = useQuranState()

  const closeRightDrawer = useCallback( () => {
    setIsRightDrawerOpen( false )
  }, [] )

  return (
    <QuranContainerWrapper>
      <QHeader className={ clsx( baseClasses.header, {
        [ baseClasses.headerShift ]: isRightDrawerOpen && ! isMobileDevice,
      } ) } />
      <main className={ clsx( classes.content, {
        [ classes.contentShift ]: isRightDrawerOpen && ! isMobileDevice,
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
        variant={ "persistent" }
      >
        <RightDrawerHeaderContainer>
          <RightDrawerHeaderTitle>Selected Verses</RightDrawerHeaderTitle>
          <ClearIcon className={ classes.clickableSvgIcon } onClick={ closeRightDrawer } />
        </RightDrawerHeaderContainer>
        {
          Object.keys( selectedAyahs ).length
            ? (
              <RightDrawerBodyReviewContainer>
                <RightDrawerBodyReviewTitle>Review</RightDrawerBodyReviewTitle>
                <RightDrawerSurahsContainer>
                  {
                    Object.keys( selectedAyahs ).map( ( surahId ) => (
                      <RightDrawerSurahContainer className={ classes.accordion } key={ surahId }>
                        <RightDrawerSurahTitleContainer expandIcon={ <KeyboardArrowDownIcon className={ classes.clickableSvgIcon } /> }>
                          <RightDrawerSurahTitle>{ surahs[ surahId ].transliterations[ 0 ].text }</RightDrawerSurahTitle>
                        </RightDrawerSurahTitleContainer>
                        <RightDrawerSurahVersesContainer>
                          {
                            selectedAyahs[ surahId ].map( ( ayahNumberInSurah ) => (
                              <RightDrawerSurahVerseContainer key={ `${ surahId }:${ ayahNumberInSurah }` }>
                                <RightDrawerSurahVerseText>Verse { ayahNumberInSurah }</RightDrawerSurahVerseText>
                                <IconButton>
                                  <RemoveIcon className={ classes.clickableSvgIcon } />
                                </IconButton>
                              </RightDrawerSurahVerseContainer>
                            ) )
                          }
                        </RightDrawerSurahVersesContainer>
                      </RightDrawerSurahContainer>
                    ) )
                  }
                </RightDrawerSurahsContainer>
              </RightDrawerBodyReviewContainer>
            ) : (
              <RightDrawerPlaceholderContainer>
                <RightDrawerPlaceholderText>You haven&apos;t selected any verse yet.<br />Select a verse to get started.</RightDrawerPlaceholderText>
              </RightDrawerPlaceholderContainer>
            )
        }
      </Drawer>
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
