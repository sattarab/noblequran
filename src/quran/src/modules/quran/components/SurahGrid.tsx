import styled from "@emotion/styled"
import { IconButton } from "@material-ui/core"
import clsx from "clsx"
import PropTypes from "prop-types"
import React, { memo, useCallback, useState } from "react"
import { useHistory } from "react-router-dom"

import { BookmarkAddIcon, BookmarkRemoveIcon } from "../../../components/Icon"
import { BORDER_COLOR, DARK_TEXT_COLOR, DEFAULT_TEXT_COLOR } from "../../../components/Styles"
import { LARGE_SCREEN_MEDIA_QUERY, MEDIUM_SCREEN_MEDIA_QUERY, SMALL_SCREEN_MEDIA_QUERY } from "../../../helpers/responsive"
import { getObjectFromLocalStorage, setObjectInLocalStorage } from "../../../helpers/utility"
import type { Surah } from "../../../types/surah"
import { useQuranState } from "./QuranContext"

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
`

const HomePageSurahGridTitleText = styled.div`
  color: ${ DARK_TEXT_COLOR };
  font-family: "QuranKarim";
  font-size: 110px;
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
  margin-top: -30px;
`

const HomePageSurahDetailsText = styled.div`
  font-size: 14px;
  font-weight: 400;
  margin-top: 5px;
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

interface QSurahGridPropTypes {
  surah: Surah
}

const QSurahGridFunction: React.FunctionComponent<QSurahGridPropTypes> = ( { surah } ) => {
  const history = useHistory()
  const [ myBookmarks, setMyBookmarks ] = useState<string[]>( getObjectFromLocalStorage( "surahBookmarks" ) || [] )
  const { baseClasses, isSurahNamesFontLoaded } = useQuranState()

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
    <HomePageSurahGridContainer
      aria-label={ surah.transliterations[ 0 ].text }
      onClick={ readSurah } key={ surah.id }
    >
      <HomePageSurahGridInnerContainer>
        <HomePageSurahGridTitleContainer>
          <HomePageSurahGridTitleText dangerouslySetInnerHTML={ { __html: surah.unicode } } style={ { visibility: isSurahNamesFontLoaded ? "visible" : "hidden" } } />
          <HomePageSurahGridTranslatedTextContainer>
            <HomePageSurahTranslatedText>{ surah.translations[ 0 ].text }</HomePageSurahTranslatedText>
          </HomePageSurahGridTranslatedTextContainer>
        </HomePageSurahGridTitleContainer>
        <HomePageSurahGridDetailsContainer>
          <HomePageSurahTransliteratedText>{ surah.number } &#8226; { surah.transliterations[ 0 ].text }</HomePageSurahTransliteratedText>
          <HomePageSurahDetailsText>{ surah.numberOfAyahs } verses &#8226; { getRevelationTypeText( surah.revelation.place ) }</HomePageSurahDetailsText>
        </HomePageSurahGridDetailsContainer>
        <HomePageSurahGridFooterContainer>
          <IconButton className={ clsx( baseClasses.iconButton ) } onClick={ toggleBookmarkSurah }>
            {
              myBookmarks.includes( surah.id )
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
  )
}

QSurahGridFunction.propTypes = {
  surah: PropTypes.shape( {
    id: PropTypes.string.isRequired,
    hasBismillah: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    number: PropTypes.number.isRequired,
    numberOfAyahs: PropTypes.number.isRequired,
    queryIndexes: PropTypes.arrayOf( PropTypes.string.isRequired ).isRequired,
    revelation: PropTypes.exact( {
      order: PropTypes.number.isRequired,
      place: PropTypes.string.isRequired
    } ).isRequired,
    translations: PropTypes.arrayOf( PropTypes.shape( {
      language: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    } ).isRequired ).isRequired,
    transliterations: PropTypes.arrayOf( PropTypes.shape( {
      language: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired
    } ).isRequired ).isRequired,
    unicode: PropTypes.string.isRequired,
  } ).isRequired,
}

export const QSurahGrid = memo( QSurahGridFunction )
