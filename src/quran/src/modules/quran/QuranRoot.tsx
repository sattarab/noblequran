import Accordion from "@material-ui/core/Accordion"
import AccordionDetails from "@material-ui/core/AccordionDetails"
import AccordionSummary from "@material-ui/core/AccordionSummary"
import Drawer from "@material-ui/core/Drawer"
import IconButton from "@material-ui/core/IconButton"
import type { Theme } from "@material-ui/core/styles"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import clsx from "clsx"
import React, { lazy, Suspense, useCallback } from "react"
import { Route, Switch } from "react-router-dom"
import styled from "styled-components"

import { ClearIcon, KeyboardArrowDownIcon, RemoveIcon } from "../../components/Icon"
import { BLUE_COLOR, BORDER_COLOR, DARKER_TEXT_COLOR, DEFAULT_TEXT_COLOR, HEADER_HEIGHT } from "../../components/Styles"
import { QButton } from "./components/Button"
import { QHeader } from "./components/Header"
import { QLoader } from "./components/Loader"
import { QuranContextProvider, useQuranState } from "./components/QuranContext"

// lazy load components
const AboutPage = lazy( () => import( "./pages/AboutPage/AboutPage" ).then( ( module ) => ( { default: module.AboutPage } ) ) )
const HomePage = lazy( () => import( "./pages/HomePage/HomePage" ).then( ( module ) => ( { default: module.HomePage } ) ) )
const SurahPage = lazy( () => import( "./pages/SurahPage/SurahPage" ).then( ( module ) => ( { default: module.SurahPage } ) ) )

const RIGHT_DRAWER_WIDTH = 320

const QuranContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const RightDrawerBodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc( 100% - ${ HEADER_HEIGHT } );
`

const RightDrawerBodyReviewContainer = styled.section`
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

const RightDrawerOptionsContainer = styled.section`
  flex: 1;
  overflow-y: auto;
  padding: 15px;
`

const RightDrawerOptionsContainerHeader = styled.h2`
  font: 500 14px/20px "HarmoniaSansPro";
`

const RightDrawerOptionsContainerHelpText = styled.p`
  font-sie
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

const RightDrawerSurahButtonsContainer = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
  font: 500 16px/16px "HarmoniaSansPro";
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
      boxShadow: "0px 1px 2px 0px rgb( 60 64 67 / 30% ), 0px 2px 6px 2px rgb( 60 64 67 / 15% )",
      width: RIGHT_DRAWER_WIDTH,
    },
  } ),
)

export const QuranContainer: React.FunctionComponent = () => {
  const classes = useStyles()
  const { baseClasses, isMobileDevice, isRightDrawerOpen, selectedAyahs, setIsRightDrawerOpen, surahs } = useQuranState()

  const closeRightDrawer = useCallback( () => {
    setIsRightDrawerOpen( false )
  }, [ setIsRightDrawerOpen ] )

  return (
    <QuranContainerWrapper>
      <QHeader className={ clsx( baseClasses.header, {
        [ baseClasses.headerShift ]: isRightDrawerOpen && ! isMobileDevice,
      } ) } />
      <main className={ clsx( classes.content, { [ classes.contentShift ]: isRightDrawerOpen && ! isMobileDevice } ) }>
        <Suspense fallback={ QLoader }>
          <Switch>
            <Route exact path="/" component={ HomePage } />
            <Route path="/about" component={ AboutPage } />
            <Route path="/:id" component={ SurahPage } />
          </Switch>
        </Suspense>
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
              <RightDrawerBodyContainer>
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
                            <RightDrawerSurahButtonsContainer>
                              <QButton isActive={ true } isDisabled={ selectedAyahs[ surahId ].length === surahs[ surahId ].numberOfAyahs } label="Add more verses" />
                              <QButton isActive={ true } label="Remove all" />
                            </RightDrawerSurahButtonsContainer>
                          </RightDrawerSurahVersesContainer>
                        </RightDrawerSurahContainer>
                      ) )
                    }
                  </RightDrawerSurahsContainer>
                </RightDrawerBodyReviewContainer>
                <RightDrawerOptionsContainer>
                  <RightDrawerOptionsContainerHeader>Format</RightDrawerOptionsContainerHeader>
                  <RightDrawerOptionsContainerHelpText>Select a format you want to download in</RightDrawerOptionsContainerHelpText>
                </RightDrawerOptionsContainer>
              </RightDrawerBodyContainer>
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
