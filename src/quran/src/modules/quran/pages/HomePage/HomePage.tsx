import React, { useState } from "react"
import { Helmet } from "react-helmet"
import { useHistory } from "react-router-dom"
import { useEffectOnce } from "react-use"
import styled from "styled-components"

import { BookmarkIcon, ClearIcon, GridIcon, ListIcon, RefreshIcon, SearchIcon } from "../../../../components/Icon"
import {
  BLUE_COLOR,
  BLUE_COLOR_WITH_OPACITY,
  BORDER_COLOR,
  DARK_TEXT_COLOR,
  DEFAULT_TEXT_COLOR,
  WHITE_SMOKE_COLOR,
} from "../../../../components/Styles"
import { LARGE_SCREEN_MEDIA_QUERY, MEDIUM_SCREEN_MEDIA_QUERY } from "../../../../helpers/responsive"
import { escapeRegex } from "../../../../helpers/utility"
import { Surah } from "../../../../types/surah"
import { useQuranState } from "../../components/QuranContext"
import { AL_QURAN } from "../../constants/common"
import { getSurahs } from "../../services/surah"

const HomePageClearIconContainer = styled.a`
  height: 24px;
  text-decoration: none;
`

const HomePageContainer = styled.div`
  margin: 0 auto;
  overflow-y: scroll;
  padding-top: 30px;

  @media ${ LARGE_SCREEN_MEDIA_QUERY } {
    max-width: 1440px;
    padding: 21px 60px 48px 60px;
  }
`

const HomePageContentContainer = styled.div`
  flex: 1;
`

const HomePageContentOptionContainer = styled.div`
`

const HomePageContentOptionsContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
`

const HomePageContentViewOptionContainer = styled.div`
  align-items: center;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: 400;

  & + & {
    margin-left: 20px;
  }

  &.active {
    font-weight: 500;

    .view-option-icon {
      fill: ${ BLUE_COLOR };
    }

    .view-option-label {
      color: ${ BLUE_COLOR };
    }
  }
`

const HomePageContentViewOptionContainerLabel = styled.div`
  margin-left: 5px;
`

const HomePageContentViewOptionsContainer = styled.div`
  align-items: center;
  display: flex;
`

const HomePageDisplayNumberContainer = styled.div`
  font-size: 12px;
  font-weight: 400;
`

const HomePageMainContainer = styled.div`
  display: flex;
  min-height: 100%;
  width: 100%;
  max-width: 100%;
`

const HomePageMyBookmarksContainer = styled.div`
  align-items: center;
  border-right: 1px solid ${ BORDER_COLOR };
  display: flex;
  height: 100%;
  padding: 0 15px;
`

const HomePageMyBookmarksButton = styled.div`
  border-radius: 5px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  padding: 10px 15px;

  &:hover {
    background-color: ${ WHITE_SMOKE_COLOR };
  }

  &.active {
    color: ${ BLUE_COLOR };

    &:hover {
      background: ${ BLUE_COLOR_WITH_OPACITY };
    }
  }
`

const HomePageRefreshIconContainer = styled.div`
  padding: 0 15px;
`

const HomePageSearchContainer = styled.div`
  align-items: center;
  border: 1px solid ${ BORDER_COLOR };
  border-radius: 48px;
  display: flex;
  flex: 1;
  height: 54px;
  margin: 0 30px 23px 30px;

  &.fixed {
    background: #ffffff;
    border: none;
    border-bottom: 1px solid ${ BORDER_COLOR };
    border-radius: 0;
    left: 0;
    margin: 0;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100;
  }
`

const HomePageSearchInput = styled.input`
  border: none;
  caret-color: ${ BLUE_COLOR };
  color: ${ DEFAULT_TEXT_COLOR };
  font-size: 16px;
  font-weight: 500;
  width: calc( 100% - 70px );

  &::-moz-placeholder,
  &:-moz-placeholder
  &::placeholder,
  &::-webkit-input-placeholder {
    color: ${ DEFAULT_TEXT_COLOR };
    font-size: 16px;
    font-weight: 500;
    line-height: 1.45;
    opacity: 1;
  }
`

const HomePageSearchInputContainer = styled.div`
  align-items: center;
  border-right: 1px solid ${ BORDER_COLOR };
  display: flex;
  height: 100%;
  min-width: 100px;
  flex: 1;
  padding-left: 15px;
`

const HomePageSurahsContentContainer = styled.div`
  padding: 15px;
`

const HomePageSurahBookmarkContainer = styled.div`
  cursor: pointer;
`

const HomePageSurahsGridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const HomePageSurahGridContainer = styled.div`
  box-sizing: border-box;
  flex: 0 1 100%;
  height: 338px;
  padding: 15px;

  @media ${ MEDIUM_SCREEN_MEDIA_QUERY } {
    flex: 0 1 33%;
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
  padding: 15px;
  flex-direction: column;
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

// eslint-disable-next-line space-in-parens
const StyledBookmarkIcon = styled(BookmarkIcon)`
  fill: ${ DEFAULT_TEXT_COLOR };

  &.active {
    fill: ${ BLUE_COLOR };
  }
`

const StyledClearIcon = styled( ClearIcon )`
  fill: ${ DEFAULT_TEXT_COLOR };
`

const StyledGridIcon = styled( GridIcon )`
  fill: ${ DEFAULT_TEXT_COLOR };
`

const StyledListIcon = styled( ListIcon )`
  fill: ${ DEFAULT_TEXT_COLOR };
`
const StyledRefreshIcon = styled( RefreshIcon )`
  fill: ${ DEFAULT_TEXT_COLOR };
`

const StyledSearchIcon = styled( SearchIcon )`
  fill: ${ DEFAULT_TEXT_COLOR };
`

enum ViewType {
  GRID = "grid",
  LIST = "list",
}

export const HomePage: React.FunctionComponent = () => {
  const MAX_SCROLL_OFFSET = 87

  const history = useHistory()
  const { isMobileDevice } = useQuranState()
  const [ isSearchContainerFixed, setIsSearchContainerFixed ] = useState<boolean>( false )
  const [ displayMyBookmarks, setMyDisplayBookmarks ] = useState<boolean>( false )
  const [ searchText, setSearchText ] = useState<string>( "" )
  const [ selectViewType, setSelectedViewType ] = useState<ViewType>( ViewType.GRID )
  const [ surahs, setSurahs ] = useState<Surah[]>( getSurahs() )

  let regex = searchText ? new RegExp( escapeRegex( searchText ), "i" ) : null

  const clearSearch = () => {
    regex = null
    setSearchText( "" )
    filterSurahs()
  }

  const filterSurahs = () => {
    if( ! regex ) {
      setSurahs( getSurahs() )
      return
    }

    const filteredSurahs: Surah[] = []

    for( const surah of getSurahs() ) {
      if( regex ) {
        for( const queryIndex of surah.query_indexes ) {
          if( regex.test( queryIndex ) ) {
            filteredSurahs.push( surah )
            break
          }
        }
      }
    }

    setSurahs( filteredSurahs )
  }

  const getRevelationTypeText = ( type: string ) => {
    return type.charAt( 0 ).toUpperCase() + type.slice( 1 )
  }

  const onPageScroll = () => {
    if( window.pageYOffset > MAX_SCROLL_OFFSET ) {
      setIsSearchContainerFixed( true )
    } else {
      setIsSearchContainerFixed( false )
    }
  }

  const onSearch = ( event: React.ChangeEvent<HTMLInputElement> ) => {
    regex = event.target.value ? new RegExp( escapeRegex( event.target.value ), "i" ) : null
    setSearchText( event.target.value )
    filterSurahs()
  }

  const readSurah = ( surah: Surah ) => {
    history.push( `/${ surah.id }` )
    window.scroll( 0, 0 )
  }

  const toggleDisplayMyBookmarks = () => {
    setMyDisplayBookmarks( ! displayMyBookmarks )
    filterSurahs()
  }

  useEffectOnce( () => {
    window.addEventListener( "scroll", onPageScroll )

    return () => {
      window.removeEventListener( "scroll", onPageScroll )
    }
  } )

  return (
    <HomePageContainer>
      <Helmet>
        <title>Browse Surahs | The Noble Quran | { AL_QURAN }</title>
      </Helmet>
      <HomePageSearchContainer className={ isSearchContainerFixed ? "fixed" : "" }>
        <HomePageSearchInputContainer>
          <StyledSearchIcon />
          <HomePageSearchInput autoComplete="false" onChange={ onSearch } placeholder="Search" type="text" value={ searchText } />
          {
            searchText && (
              <HomePageClearIconContainer onClick={ clearSearch } >
                <StyledClearIcon />
              </HomePageClearIconContainer>
            )
          }
        </HomePageSearchInputContainer>
        <HomePageMyBookmarksContainer onClick={ toggleDisplayMyBookmarks }>
          {
            isMobileDevice
            ? (
              <StyledBookmarkIcon className={ displayMyBookmarks ?  "active" :  "" }/>
            ) : (
              <HomePageMyBookmarksButton className={ displayMyBookmarks ?  "active" :  "" }>My Bookmarks</HomePageMyBookmarksButton>
            )
          }
        </HomePageMyBookmarksContainer>
        <HomePageRefreshIconContainer>
          <StyledRefreshIcon />
        </HomePageRefreshIconContainer>
      </HomePageSearchContainer>
      <HomePageMainContainer>
        <HomePageContentContainer>
          <HomePageContentOptionsContainer>
            <HomePageContentOptionContainer>
              <HomePageContentViewOptionsContainer>
                <HomePageContentViewOptionContainer onClick={ () => setSelectedViewType( ViewType.GRID ) } className={ selectViewType === ViewType.GRID ? "active" : "" }>
                  <StyledGridIcon className="view-option-icon" />
                  <HomePageContentViewOptionContainerLabel className="view-option-label">Grid</HomePageContentViewOptionContainerLabel>
                </HomePageContentViewOptionContainer>
                <HomePageContentViewOptionContainer onClick={ () => setSelectedViewType( ViewType.LIST ) } className={ selectViewType === ViewType.LIST ? "active" : "" }>
                  <StyledListIcon className="view-option-icon" />
                  <HomePageContentViewOptionContainerLabel className="view-option-label">List</HomePageContentViewOptionContainerLabel>
                </HomePageContentViewOptionContainer>
              </HomePageContentViewOptionsContainer>
            </HomePageContentOptionContainer>
            <HomePageDisplayNumberContainer>
              { surahs.length } of 114 surahs
            </HomePageDisplayNumberContainer>
          </HomePageContentOptionsContainer>
          <HomePageSurahsContentContainer>
            {
              selectViewType === ViewType.GRID
              ? (
                <HomePageSurahsGridContainer>
                  {
                    surahs.map( ( surah ) => (
                      <HomePageSurahGridContainer key={ surah.id } onClick={ () => readSurah( surah ) }>
                        <HomePageSurahGridInnerContainer>
                          <HomePageSurahGridTitleContainer>
                            <HomePageSurahGridTitleText dangerouslySetInnerHTML={ { __html: surah.unicode } } />
                            <HomePageSurahGridTranslatedTextContainer>
                              <HomePageSurahTranslatedText>{ surah.translations[ 0 ].text }</HomePageSurahTranslatedText>
                            </HomePageSurahGridTranslatedTextContainer>
                          </HomePageSurahGridTitleContainer>
                          <HomePageSurahGridDetailsContainer>
                            <HomePageSurahTransliteratedText>{ surah.number } &#8226; { surah.transliterations[ 0 ].text }</HomePageSurahTransliteratedText>
                            <HomePageSurahDetailsText>{ surah.number_of_ayahs } verses &#8226; { getRevelationTypeText( surah.revelation.place ) }</HomePageSurahDetailsText>
                          </HomePageSurahGridDetailsContainer>
                          <HomePageSurahGridFooterContainer>
                            <HomePageSurahBookmarkContainer>
                              <StyledBookmarkIcon />
                            </HomePageSurahBookmarkContainer>
                            <HomePageSurahGridReadSurahButton>Read</HomePageSurahGridReadSurahButton>
                          </HomePageSurahGridFooterContainer>
                        </HomePageSurahGridInnerContainer>
                      </HomePageSurahGridContainer>
                    ) )
                  }
                </HomePageSurahsGridContainer>
              ) : (
                <HomePageSurahsListContainer>
                  {
                    surahs.map( ( surah ) => (
                      <HomePageSurahListContainer key={ surah.id } onClick={ () => readSurah( surah ) }>
                        <HomePageSurahListTitleContainer>
                          <HomePageSurahTranslatedText>{ surah.translations[ 0 ].text }</HomePageSurahTranslatedText>
                          <HomePageSurahListTitleText dangerouslySetInnerHTML={ { __html: surah.unicode } } />
                        </HomePageSurahListTitleContainer>
                        <HomePageSurahListDetailsContainer>
                          <HomePageSurahTransliteratedText>{ surah.number } &#8226; { surah.transliterations[ 0 ].text }</HomePageSurahTransliteratedText>
                          <HomePageSurahListDetailsText>{ surah.number_of_ayahs } verses &#8226; { getRevelationTypeText( surah.revelation.place ) }</HomePageSurahListDetailsText>
                          <HomePageSurahBookmarkContainer>
                            <StyledBookmarkIcon />
                          </HomePageSurahBookmarkContainer>
                        </HomePageSurahListDetailsContainer>
                      </HomePageSurahListContainer>
                    ) )
                  }
                </HomePageSurahsListContainer>
              )
            }
          </HomePageSurahsContentContainer>
        </HomePageContentContainer>
      </HomePageMainContainer>
    </HomePageContainer>
  )
}
