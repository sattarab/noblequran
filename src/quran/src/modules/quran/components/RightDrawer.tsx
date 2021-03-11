import styled from "@emotion/styled"
import Accordion from "@material-ui/core/Accordion"
import AccordionDetails from "@material-ui/core/AccordionDetails"
import AccordionSummary from "@material-ui/core/AccordionSummary"
import Button from "@material-ui/core/Button"
import Checkbox from "@material-ui/core/Checkbox"
import Drawer from "@material-ui/core/Drawer"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import IconButton from "@material-ui/core/IconButton"
import { createStyles, makeStyles, withStyles } from "@material-ui/core/styles"
import React, { useCallback, useState } from "react"
import { useHistory } from "react-router-dom"

import { ClearIcon, DownloadIcon, KeyboardArrowDownIcon, RemoveIcon } from "../../../components/Icon"
import { BLUE_COLOR, BORDER_COLOR, DARKER_TEXT_COLOR, DEFAULT_TEXT_COLOR, HEADER_HEIGHT, RIGHT_DRAWER_WIDTH } from "../../../components/Styles"
import { useAppDispatch, useAppSelector } from "../../../hooks"
import type { Option } from "../../../types/option"
import { removeAyah, removeAyahsForSurah, setIsRightDrawerOpen } from "../state/quran"
import { QButton } from "./Button"
import { useQuranState } from "./QuranContext"

const FOOTER_HEIGHT = "64px"

const RightDrawerBodyContainer = styled.div`
  flex: 1;
  max-height: calc( 100% - ${ FOOTER_HEIGHT } );
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

const RightDrawerContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc( 100% - ${ HEADER_HEIGHT } );
`

const RightDrawerFooterContainer = styled.div`
  align-items: center;
  border-top: 1px solid ${ BORDER_COLOR };
  display: flex;
  flex-direction: row;
  height: ${ FOOTER_HEIGHT };
  padding: 0 15px;
`

const RightDrawerFooterDownloadButton = styled( Button )`
  background: ${ BLUE_COLOR };
  border: 2px solid ${ BLUE_COLOR };
  color: #ffffff;
  font: 700 16px/22px "HarmoniaSansPro";
  height: 35px;
  text-transform: none;

  :hover {
    background: ${ BLUE_COLOR };
  }
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

const StyledFormControlLabel = withStyles( {
  label: {
    "fontSize": "15px",
    "fontWeight": 500,
    "whiteSpace": "normal",
  },
} )( FormControlLabel )

const StyledDownloadIcon = styled( DownloadIcon )`
  fill: #ffffff;
  height: 18px;
  margin-right: 5px;
  width: 18px;
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

enum FormatType {
  INDOPAK = "indopak",
  MUSHAF = "mushaf",
  UTHMANI = "uthmani",
}

export const QRightDrawer: React.FunctionComponent = () => {
  const classes = useStyles()
  const dispatch = useAppDispatch()
  const history = useHistory()
  const isRightDrawerOpen = useAppSelector( ( state ) => state.quran.isRightDrawerOpen )
  const selectedAyahs = useAppSelector( ( state ) => state.quran.selectedAyahs )
  const [ selectedFormats, setSelectedFormats ] = useState<string[]>( [] )

  const { isMobileDevice, surahs } = useQuranState()

  const formatOptions: Array<Option<FormatType>> = [
    {
      label: "Uthmani",
      value: FormatType.UTHMANI,
    },
    {
      label: "Mushaf",
      value: FormatType.MUSHAF,
    },
    {
      label: "IndoPak",
      value: FormatType.INDOPAK,
    },
  ]

  const closeRightDrawer = useCallback( () => {
    dispatch( setIsRightDrawerOpen() )
  }, [ dispatch ] )

  const onFormatTypeToggle = useCallback( ( type: FormatType ) => {
    const updatedSelectedFormats = [ ...selectedFormats ]
    const index = updatedSelectedFormats.indexOf( type )

    if( index !== -1 ) {
      updatedSelectedFormats.splice( index, 1 )
    } else {
      updatedSelectedFormats.push( type )
    }

    setSelectedFormats( updatedSelectedFormats )
  }, [ selectedFormats ] )

  const readSurah = useCallback( ( surahId: string ) => {
    history.push( `/${ surahId }` )
    window.scroll( 0, 0 )
    if( isMobileDevice ) {
      dispatch( setIsRightDrawerOpen() )
    }
  }, [ dispatch, history, isMobileDevice ] )

  const remove = useCallback( ( surahId: string, ayahNumberInSurah: string ) => {
    dispatch( removeAyah( { ayahId: ayahNumberInSurah, surahId } ) )
  }, [ dispatch ] )

  const removeAll = useCallback( ( surahId: string ) => {
    dispatch( removeAyahsForSurah( surahId ) )
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
            <RightDrawerContentContainer>
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
                                color={ "secondary" }
                                isDisabled={ selectedAyahs[ surahId ].length === surahs[ surahId ].numberOfAyahs }
                                label="Add more verses"
                                onClick={ () => readSurah( surahId ) }
                                style={ { marginLeft: "-5px", padding: "10px 5px" } }
                              />
                              <QButton
                                color={ "secondary" }
                                label="Remove all"
                                onClick={ () => removeAll( surahId ) }
                                style={ { padding: "10px 5px" } }
                              />
                            </RightDrawerSurahButtonsContainer>
                          </RightDrawerSurahVersesContainer>
                        </RightDrawerSurahContainer>
                      ) )
                    }
                  </RightDrawerSurahsContainer>
                </RightDrawerBodyReviewContainer>
                <RightDrawerOptionsContainer>
                  <RightDrawerOptionsContainerHeader>Options</RightDrawerOptionsContainerHeader>
                  <RightDrawerOptionsContainerHelpText>Select the formats you wish to download</RightDrawerOptionsContainerHelpText>
                  <div>
                    {
                      formatOptions.map( ( option ) => (
                        <div key={ option.value }>
                          <StyledFormControlLabel
                            control={
                              <Checkbox
                                checked={ selectedFormats.indexOf( option.value ) !== -1 }
                                onChange={ () => onFormatTypeToggle( option.value ) }
                              />
                            }
                            label={ option.label }
                          />
                        </div>
                      ) )
                    }
                  </div>
                </RightDrawerOptionsContainer>
              </RightDrawerBodyContainer>
              <RightDrawerFooterContainer>
                <RightDrawerFooterDownloadButton fullWidth>
                  <StyledDownloadIcon />
                  <span>Download All</span>
                </RightDrawerFooterDownloadButton>
              </RightDrawerFooterContainer>
            </RightDrawerContentContainer>
          ) : (
            <RightDrawerPlaceholderContainer>
              <RightDrawerPlaceholderText>You haven&apos;t selected any verse yet.<br />Select a verse to get started.</RightDrawerPlaceholderText>
            </RightDrawerPlaceholderContainer>
          )
      }
    </Drawer>
  )
}
