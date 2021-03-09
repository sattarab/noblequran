import styled from "@emotion/styled"
import Accordion from "@material-ui/core/Accordion"
import AccordionDetails from "@material-ui/core/AccordionDetails"
import AccordionSummary from "@material-ui/core/AccordionSummary"
import Drawer from "@material-ui/core/Drawer"
import IconButton from "@material-ui/core/IconButton"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import React, { useCallback } from "react"
import { useHistory } from "react-router-dom"

import { ClearIcon, KeyboardArrowDownIcon, RemoveIcon } from "../../../components/Icon"
import { BLUE_COLOR, BORDER_COLOR, DARKER_TEXT_COLOR, DEFAULT_TEXT_COLOR, HEADER_HEIGHT, RIGHT_DRAWER_WIDTH } from "../../../components/Styles"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import { removeAyah, removeAyahsForSurah, setIsRightDrawerOpen } from "../state/quran"
import { QButton } from "./Button"
import { useQuranState } from "./QuranContext"

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

const RightDrawerHeaderTitle = styled.h1`
  color: ${ DARKER_TEXT_COLOR };
  flex: 1;
  font: 500 16px/24px "HarmoniaSansPro";
  letter-spacing: 0.1px;
`

const RightDrawerOptionsContainer = styled.section`
  flex: 1;
  overflow-y: auto;
  padding: 15px;
`

const RightDrawerOptionsContainerHeader = styled.h2`
  color: ${ DARKER_TEXT_COLOR };
  font: 500 14px/20px "HarmoniaSansPro";
  margin: 0 0 24px;
`

const RightDrawerOptionsContainerHelpText = styled.p`
  font-size: 14px;
`

const RightDrawerPlaceholderContainer = styled.div`
  align-items: center;
  display: flex;
  height: calc( 100% - ${ HEADER_HEIGHT } );
  padding: 0 15px;
`

const RightDrawerPlaceholderText = styled.p`
  color: ${ DARKER_TEXT_COLOR };
  font: 400 14px/20px "HarmoniaSansPro";
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

const useStyles = makeStyles( () =>
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
    drawer: {
      flexShrink: 0,
    },
    drawerPaper: {
      background: "#ffffff",
      boxShadow: "0px 1px 2px 0px rgb( 60 64 67 / 30% ), 0px 2px 6px 2px rgb( 60 64 67 / 15% )",
      paddingBottom: HEADER_HEIGHT,
      width: RIGHT_DRAWER_WIDTH,
    },
  } ),
)

export const QRightDrawer: React.FunctionComponent = () => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const history = useHistory()
  const isRightDrawerOpen = useAppSelector( ( state ) => state.quran.isRightDrawerOpen )
  const selectedAyahs = useAppSelector( ( state ) => state.quran.selectedAyahs )

  const { isMobileDevice, surahs } = useQuranState()

  const closeRightDrawer = useCallback( () => {
    dispatch( setIsRightDrawerOpen() )
  }, [ dispatch ] )

  const readSurah = useCallback( ( surahId: string ) => {
    history.push( `/${ surahId }` )
    window.scroll( 0, 0 )
    if( isMobileDevice ) {
      dispatch( setIsRightDrawerOpen() )
    }
  }, [ dispatch, history, isMobileDevice ] )

  const removeAll = useCallback( ( surahId: string ) => {
    dispatch( removeAyahsForSurah( surahId ) )
  }, [ dispatch ] )

  const remove = useCallback( ( surahId: string, ayahNumberInSurah: string ) => {
    dispatch( removeAyah( { ayahId: ayahNumberInSurah, surahId } ) )
  }, [ dispatch ] )

  return (
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
                                  <RemoveIcon className={ classes.clickableSvgIcon } onClick={ () => remove( surahId, ayahNumberInSurah ) } />
                                </IconButton>
                              </RightDrawerSurahVerseContainer>
                            ) )
                          }
                          <RightDrawerSurahButtonsContainer>
                            <QButton
                              isActive={ true }
                              isDisabled={ selectedAyahs[ surahId ].length === surahs[ surahId ].numberOfAyahs }
                              label="Add more verses"
                              onClick={ () => readSurah( surahId ) }
                            />
                            <QButton isActive={ true } label="Remove all" onClick={ () => removeAll( surahId ) } />
                          </RightDrawerSurahButtonsContainer>
                        </RightDrawerSurahVersesContainer>
                      </RightDrawerSurahContainer>
                    ) )
                  }
                </RightDrawerSurahsContainer>
              </RightDrawerBodyReviewContainer>
              <RightDrawerOptionsContainer>
                <RightDrawerOptionsContainerHeader>Format</RightDrawerOptionsContainerHeader>
                <RightDrawerOptionsContainerHelpText>Select all the formats you want to download in</RightDrawerOptionsContainerHelpText>
              </RightDrawerOptionsContainer>
            </RightDrawerBodyContainer>
          ) : (
            <RightDrawerPlaceholderContainer>
              <RightDrawerPlaceholderText>You haven&apos;t selected any verse yet.<br />Select a verse to get started.</RightDrawerPlaceholderText>
            </RightDrawerPlaceholderContainer>
          )
      }
    </Drawer>
  )
}