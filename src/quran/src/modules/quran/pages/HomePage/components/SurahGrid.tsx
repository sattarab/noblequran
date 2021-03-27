import styled from "@emotion/styled"
import { IconButton } from "@material-ui/core"
import React, { memo, useCallback } from "react"
import { useHistory } from "react-router-dom"

import { BookmarkAddIcon, BookmarkRemoveIcon } from "../../../../../components/Icon"
import { BORDER_COLOR, DARK_TEXT_COLOR, DEFAULT_TEXT_COLOR } from "../../../../../components/Styles"
import { LARGE_SCREEN_MEDIA_QUERY, MEDIUM_SCREEN_MEDIA_QUERY, SMALL_SCREEN_MEDIA_QUERY } from "../../../../../helpers/responsive"
import { capitalize } from "../../../../../helpers/utility"
import { useAppDispatch, useAppSelector } from "../../../../../hooks"
import { useQuranState } from "../../../components/QuranContext"
import { readSurah } from "../../../services/surah"
import { toggleBookmark } from "../state/home"

const HomePageSurahsGridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const HomePageSurahGridContainer = styled.div`
  box-sizing: border-box;
  flex: 0 1 100%;
  height: 338px;
  padding: 15px;

  @media ${ SMALL_SCREEN_MEDIA_QUERY } {
    flex: 0 1 50%;
  }

  @media ${ MEDIUM_SCREEN_MEDIA_QUERY } {
    flex: 0 1 33.33%;
  }

  @media ${ LARGE_SCREEN_MEDIA_QUERY } {
    flex: 0 1 25%;
  }
`

const HomePageSurahGridInnerContainer = styled.div`
  border: 1px solid ${ BORDER_COLOR };
  border-radius: 8px;
  cursor: pointer;
  height: 100%;

  &:hover {
    box-shadow: 0px 1px 2px 0px rgba( 60, 64, 67, 0.3 ), 0px 2px 6px 2px rgba( 60, 64, 67, 0.15 );
    transform: translateY( -1px );
  }
`

const HomePageSurahGridTitleContainer = styled.div`
  align-items: center;
  border-bottom: 1px solid ${ BORDER_COLOR };
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  display: flex;
  flex-direction: column;
  height: 150px;
  justify-content: center;
  overflow: hidden;
  position: relative;
`

const HomePageSurahGridTitleText = styled.div`
  color: ${ DARK_TEXT_COLOR };
  font-family: "QuranKarim";
  font-size: 110px;
  margin-bottom: 20px;
`

const HomePageSurahGridDetailsContainer = styled.div`
  border-bottom: 1px solid ${ BORDER_COLOR };
  display: flex;
  flex-direction: column;
  padding: 15px;
`

const HomePageSurahGridFooterContainer = styled.div`
  align-items: flex-end;
  box-sizing: border-box;
  display: flex;
  height: 85px;
  justify-content: space-between;
  padding: 15px;
`

const HomePageSurahGridReadSurahButton = styled.button`
  background: #ffffff;
  border: 2px solid ${ DEFAULT_TEXT_COLOR };
  border-radius: 25px;
  color: ${ DEFAULT_TEXT_COLOR };
  cursor: pointer;
  height: 32px;
  font-size: 14px;
  font-weight: 500;
  padding: 0 15px;

  &:hover {
    background: ${ DEFAULT_TEXT_COLOR };
    color: #ffffff;
  }
`

const HomePageSurahGridTranslatedTextContainer = styled.div`
  position: absolute;
  margin-top: 90px;
`

const HomePageSurahDetailsText = styled.div`
  font-size: 14px;
  font-weight: 400;
  margin-top: 5px;
`

const HomePageSurahTranslatedText = styled.h2`
  color: ${ DEFAULT_TEXT_COLOR };
  font: 500 14px/20px "HarmoniaSansPro";
  margin: 0;
`

const HomePageSurahTransliteratedText = styled.h1`
  font: 500 15px/22px "HarmoniaSansPro";
  margin: 0;
`

const SurahGridFunction: React.FunctionComponent = () => {
  const bookmarks = useAppSelector( ( state ) => state.home.bookmarks )
  const dispatch = useAppDispatch()
  const history = useHistory()
  const isTitleFontLoaded = useAppSelector( ( state ) => state.quran.isTitleFontLoaded )
  const surahs = useAppSelector( ( state ) => state.home.surahs )

  const { baseClasses } = useQuranState()

  const toggleBookmarkSurah = useCallback( ( event: React.MouseEvent<HTMLButtonElement, MouseEvent>, surahId: string ) => {
    event.preventDefault()
    event.stopPropagation()
    dispatch( toggleBookmark( surahId ) )
  }, [ dispatch ] )

  return (
    <HomePageSurahsGridContainer>
      {
        surahs.map( ( surah ) => (
          <HomePageSurahGridContainer
            aria-label={ surah.transliterations[ 0 ].text }
            onClick={ () => readSurah( history, surah.slug ) } key={ surah.id }
          >
            <HomePageSurahGridInnerContainer>
              <HomePageSurahGridTitleContainer>
                <>
                  {
                    isTitleFontLoaded && (
                      <HomePageSurahGridTitleText dangerouslySetInnerHTML={ { __html: surah.unicode } } />
                    )
                  }
                </>
                <HomePageSurahGridTranslatedTextContainer>
                  <HomePageSurahTranslatedText>{ surah.translations[ 0 ].text }</HomePageSurahTranslatedText>
                </HomePageSurahGridTranslatedTextContainer>
              </HomePageSurahGridTitleContainer>
              <HomePageSurahGridDetailsContainer>
                <HomePageSurahTransliteratedText>{ surah.number } &#8226; { surah.transliterations[ 0 ].text }</HomePageSurahTransliteratedText>
                <HomePageSurahDetailsText>{ surah.numberOfAyahs } verses &#8226; { capitalize( surah.revelation.place ) }</HomePageSurahDetailsText>
              </HomePageSurahGridDetailsContainer>
              <HomePageSurahGridFooterContainer>
                <IconButton className={ baseClasses.iconButton } onClick={ ( event ) => toggleBookmarkSurah( event, surah.id ) }>
                  {
                    bookmarks.includes( surah.id )
                      ? (
                        <BookmarkRemoveIcon className={ baseClasses.svgIconActive } />
                      ) : (
                        <BookmarkAddIcon className={ baseClasses.svgIcon } />
                      )
                  }
                </IconButton>
                <HomePageSurahGridReadSurahButton>Read</HomePageSurahGridReadSurahButton>
              </HomePageSurahGridFooterContainer>
            </HomePageSurahGridInnerContainer>
          </HomePageSurahGridContainer>
        ) )
      }
    </HomePageSurahsGridContainer>
  )
}

export const SurahGrid = memo( SurahGridFunction )
