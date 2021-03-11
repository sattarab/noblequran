import styled from "@emotion/styled"
import { IconButton } from "@material-ui/core"
import React, { memo, useCallback } from "react"
import { useHistory } from "react-router-dom"

import { BookmarkAddIcon, BookmarkRemoveIcon } from "../../../../../components/Icon"
import { BORDER_COLOR, DARK_TEXT_COLOR, DEFAULT_TEXT_COLOR } from "../../../../../components/Styles"
import { capitalize } from "../../../../../helpers/utility"
import { useAppDispatch, useAppSelector } from "../../../../../hooks"
import { useQuranState } from "../../../components/QuranContext"
import { readSurah } from "../../../services/surah"
import { toggleBookmark } from "../state/home"

const HomePageSurahsListContainer = styled.div`
  padding: 15px;
`

const HomePageSurahListContainer = styled.div`
  border-top: 1px solid ${ BORDER_COLOR };
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  padding: 15px 0;

  &:last-of-type {
    border-bottom: 1px solid ${ BORDER_COLOR };
  }
`

const HomePageSurahListDetailsContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`

const HomePageSurahListDetailsText = styled.div`
  font-size: 14px;
  font-weight: 500;
  margin: 0 10px;
`

const HomePageSurahListTitleContainer = styled.div`
  display: flex;
  margin-top: 10px;
`

const HomePageSurahListTextContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
`

const HomePageSurahListTitleText = styled.div`
  color: ${ DARK_TEXT_COLOR };
  flex: 1;
  font-family: "QuranKarim";
  font-size: 110px;
  text-align: right;
  margin-top: -50px;
`

const HomePageSurahTranslatedText = styled.h2`
  color: ${ DEFAULT_TEXT_COLOR };
  font: 500 14px/20px "HarmoniaSansPro";
  margin: 0;
`

const HomePageSurahTransliteratedText = styled.h1`
  flex: 1;
  font: 500 15px/22px "HarmoniaSansPro";
  margin: 0;
`

const SurahListFunction: React.FunctionComponent = () => {
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
    <HomePageSurahsListContainer>
      {
        surahs.map( ( surah ) =>
          <HomePageSurahListContainer aria-label={ surah.transliterations[ 0 ].text } onClick={ () => readSurah( history, surah.id ) } key={ surah.id }>
            <HomePageSurahListTitleContainer>
              <HomePageSurahTranslatedText>{ surah.translations[ 0 ].text }</HomePageSurahTranslatedText>
              <>
                {
                  isTitleFontLoaded && (
                    <HomePageSurahListTitleText dangerouslySetInnerHTML={ { __html: surah.unicode } } />
                  )
                }
              </>
            </HomePageSurahListTitleContainer>
            <HomePageSurahListDetailsContainer>
              <HomePageSurahListTextContainer>
                <HomePageSurahTransliteratedText> { surah.number } &#8226; { surah.transliterations[ 0 ].text }</HomePageSurahTransliteratedText>
                <HomePageSurahListDetailsText>{ surah.numberOfAyahs } verses &#8226; { capitalize( surah.revelation.place ) }</HomePageSurahListDetailsText>
              </HomePageSurahListTextContainer>
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
            </HomePageSurahListDetailsContainer>
          </HomePageSurahListContainer>
        )
      }
    </HomePageSurahsListContainer>
  )
}

export const SurahList = memo( SurahListFunction )
