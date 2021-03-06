import styled from "@emotion/styled"
import { IconButton } from "@material-ui/core"
import PropTypes from "prop-types"
import React, { memo } from "react"

import { BookmarkAddIcon, BookmarkRemoveIcon } from "../../../../../components/Icon"
import { BORDER_COLOR, DARK_TEXT_COLOR, DEFAULT_TEXT_COLOR } from "../../../../../components/Styles"
import type { Surah } from "../../../../../types/surah"
import { useQuranState } from "../../../components/QuranContext"
import { SurahPropType } from "../../../services/surah"
import { useHomeState } from "../HomePage"

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
  font-size: 15px;
  font-weight: 700;
`

interface SurahList {
  surahs: Surah[]
}

const SurahListFunction: React.FunctionComponent<SurahList> = ( { surahs } ) => {
  const { getRevelationTypeText, readSurah, toggleBookmarkSurah } = useHomeState()
  const { baseClasses, isSurahNamesFontLoaded, myBookmarks } = useQuranState()

  return (
    <HomePageSurahsListContainer>
      {
        surahs.map( ( surah ) =>
          <HomePageSurahListContainer aria-label={ surah.transliterations[ 0 ].text } onClick={ () => readSurah( surah.id ) } key={ surah.id }>
            <HomePageSurahListTitleContainer>
              <HomePageSurahTranslatedText>{ surah.translations[ 0 ].text }</HomePageSurahTranslatedText>
              <HomePageSurahListTitleText dangerouslySetInnerHTML={ { __html: surah.unicode } } style={ { visibility: isSurahNamesFontLoaded ? "visible" : "hidden" } } />
            </HomePageSurahListTitleContainer>
            <HomePageSurahListDetailsContainer>
              <HomePageSurahTransliteratedText>{ surah.number } &#8226; { surah.transliterations[ 0 ].text }</HomePageSurahTransliteratedText>
              <HomePageSurahListDetailsText>{ surah.numberOfAyahs } verses &#8226; { getRevelationTypeText( surah.revelation.place ) }</HomePageSurahListDetailsText>
              <IconButton className={ baseClasses.iconButton } onClick={ ( event ) => toggleBookmarkSurah( event, surah.id ) }>
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
    </HomePageSurahsListContainer>
  )
}


SurahListFunction.propTypes = {
  surahs: PropTypes.arrayOf( SurahPropType ).isRequired,
}

export const SurahList = memo( SurahListFunction )
