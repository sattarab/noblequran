import styled from "@emotion/styled"
import { IconButton } from "@material-ui/core"
import React, { memo, useCallback } from "react"
import { useHistory } from "react-router-dom"

import { BookmarkAddIcon, BookmarkRemoveIcon } from "../../../../../components/Icon"
import { BORDER_COLOR, DARK_TEXT_COLOR, DEFAULT_TEXT_COLOR } from "../../../../../components/Styles"
import { setObjectInLocalStorage } from "../../../../../helpers/utility"
import type { Surah } from "../../../../../types/surah"
import { useQuranState } from "../../../components/QuranContext"
import { SurahPropType } from "../../../services/surah"

const HomePageSurahListContainer = styled.div`
  border-top: 1px solid ${ BORDER_COLOR };
  box-sizing: border-box;
  cursor: pointer;
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px 0;

  &:last-of-type {
    border-bottom: 1px solid ${ BORDER_COLOR };
  }
`

const HomePageSurahListDetailsContainer = styled.div`
  align-items: center;
  display: flex;
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

const HomePageSurahListTitleText = styled.div`
  color: ${ DARK_TEXT_COLOR };
  flex: 1;
  font-family: "QuranKarim";
  font-size: 110px;
  text-align: right;
  margin-top: -50px;
`

const HomePageSurahTranslatedText = styled.div`
  color: ${ DEFAULT_TEXT_COLOR };
  font-size: 14px;
  font-weight: 500;
`

const HomePageSurahTransliteratedText = styled.div`
  font-size: 16px;
  font-weight: 500;
`

interface SurahList {
  surah: Surah
}

const QSurahListFunction: React.FunctionComponent<SurahList> = ( { surah } ) => {
  const history = useHistory()
  const { baseClasses, isSurahNamesFontLoaded, myBookmarks, setMyBookmarks } = useQuranState()

  const getRevelationTypeText = useCallback( ( type: string ) => {
    return type.charAt( 0 ).toUpperCase() + type.slice( 1 )
  }, [] )

  const readSurah = useCallback( () => {
    history.push( `/${ surah.id }` )
    window.scroll( 0, 0 )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ history ] )

  const toggleBookmarkSurah = useCallback( ( event: React.MouseEvent<HTMLButtonElement, MouseEvent> ) => {
    event.preventDefault()
    event.stopPropagation()

    const updatedMyBookmarks = [ ...myBookmarks ]
    const index = updatedMyBookmarks.indexOf( surah.id )
    if( index !== -1 ) {
      updatedMyBookmarks.splice( index, 1 )
    } else {
      updatedMyBookmarks.push( surah.id )
    }
    setObjectInLocalStorage( "surahBookmarks", updatedMyBookmarks )
    setMyBookmarks( updatedMyBookmarks )
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ myBookmarks ] )

  return (
    <HomePageSurahListContainer aria-label={ surah.transliterations[ 0 ].text } onClick={ readSurah } key={ surah.id }>
      <HomePageSurahListTitleContainer>
        <HomePageSurahTranslatedText>{ surah.translations[ 0 ].text }</HomePageSurahTranslatedText>
        <HomePageSurahListTitleText dangerouslySetInnerHTML={ { __html: surah.unicode } } style={ { visibility: isSurahNamesFontLoaded ? "visible" : "hidden" } } />
      </HomePageSurahListTitleContainer>
      <HomePageSurahListDetailsContainer>
        <HomePageSurahTransliteratedText>{ surah.number } &#8226; { surah.transliterations[ 0 ].text }</HomePageSurahTransliteratedText>
        <HomePageSurahListDetailsText>{ surah.numberOfAyahs } verses &#8226; { getRevelationTypeText( surah.revelation.place ) }</HomePageSurahListDetailsText>
        <IconButton className={ baseClasses.iconButton } onClick={ toggleBookmarkSurah }>
          {
            myBookmarks.includes( surah.id )
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


QSurahListFunction.propTypes = {
  surah: SurahPropType,
}

export const QSurahList = memo( QSurahListFunction )
