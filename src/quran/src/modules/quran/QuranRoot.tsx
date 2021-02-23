import Drawer from "@material-ui/core/Drawer"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"
import clsx from "clsx"
import React, { useCallback } from "react"
import { Route, Switch } from "react-router-dom"
import styled from "styled-components"

import { ClearIcon, KeyboardArrowDownIcon, KeyboardArrowUpIcon } from "../../components/Icon"
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
  padding: 15px 15px;
`

const RightDrawerBodyReviewTitle = styled.div`
  font-size: 14px;
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

const RightDrawerSurahContainer = styled.div`
  border: 1px solid ${ BORDER_COLOR };
  border-radius: 5px;
  padding: 10px 15px;

  & + & {
    margin-top: 10px;
  }
`

const RightDrawerSurahTitle = styled.div`
  color: ${ BLUE_COLOR };
  flex: 1;
  font-size: 16px;
  font-weight: 500;
`

const RightDrawerSurahTitleContainer = styled.div`
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

const RightDrawerSurahVersesContainer = styled.div`
`

const RightDrawerSurahsContainer = styled.div`
  margin-top: 25px;
`

const useStyles = makeStyles( ( theme: Theme ) =>
  createStyles( {
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
      width: RIGHT_DRAWER_WIDTH,
    },
    drawerPaper: {
      background: "#ffffff",
      width: RIGHT_DRAWER_WIDTH,
    },
  } ),
)

export const QuranContainer: React.FunctionComponent = () => {
  const classes = useStyles()
  const { displaySurahVersesMap, isMobileDevice, isRightDrawerOpen, selectedAyahs, setDisplaySurahVersesMap, setIsRightDrawerOpen, surahs } = useQuranState()

  const closeRightDrawer = useCallback( () => {
    setIsRightDrawerOpen( false )
  }, [] )

  const toggleSurah = useCallback( ( surahId: string, open: boolean ) => {
    const updatedDisplaySurahVersesMap = { ...displaySurahVersesMap, [ surahId ]: open }
    setDisplaySurahVersesMap( updatedDisplaySurahVersesMap )
  }, [ displaySurahVersesMap ] )

  return (
    <QuranContainerWrapper>
      <QHeader className={ clsx( classes.header, {
        [ classes.headerShift ]: isRightDrawerOpen && ! isMobileDevice,
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
          ?  (
            <div>
              <RightDrawerBodyReviewContainer>
                <RightDrawerBodyReviewTitle>Review</RightDrawerBodyReviewTitle>
                <RightDrawerSurahsContainer>
                  {
                    Object.keys( selectedAyahs ).map( ( surahId ) => (
                      <RightDrawerSurahContainer key={ surahId }>
                        <RightDrawerSurahTitleContainer onClick={ () => toggleSurah( surahId, ! displaySurahVersesMap[ surahId ] )}>
                          <RightDrawerSurahTitle>{ surahs[ surahId ].transliterations[ 0 ].text }</RightDrawerSurahTitle>
                          {
                            displaySurahVersesMap[ surahId ]
                            ? (
                              <KeyboardArrowUpIcon className={ clsx( classes.clickableSvgIcon ) }/>
                            ) : (
                              <KeyboardArrowDownIcon className={ clsx( classes.clickableSvgIcon ) }/>
                            )
                          }
                        </RightDrawerSurahTitleContainer>
                        {
                          displaySurahVersesMap[ surahId ] && (
                            <RightDrawerSurahVersesContainer>
                              {
                                selectedAyahs[ surahId ].map( ( ayahNumberInSurah ) => (
                                  <RightDrawerSurahVerseContainer key={ `${ surahId }:${ ayahNumberInSurah }` }>
                                    <RightDrawerSurahVerseText>Verse { ayahNumberInSurah }</RightDrawerSurahVerseText>
                                  </RightDrawerSurahVerseContainer>
                                ) )
                              }
                            </RightDrawerSurahVersesContainer>
                          )
                        }
                      </RightDrawerSurahContainer>
                    ) )
                  }
                </RightDrawerSurahsContainer>
              </RightDrawerBodyReviewContainer>
            </div>
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
