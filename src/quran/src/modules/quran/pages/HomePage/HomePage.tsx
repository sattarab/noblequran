import styled from "@emotion/styled"
import Button from "@material-ui/core/Button"
import IconButton from "@material-ui/core/IconButton"
import clsx from "clsx"
import React, { useCallback, useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import { useEffectOnce } from "react-use"

import { BookmarksIcon, ClearIcon, GridIcon, ListIcon, RefreshIcon, SearchIcon } from "../../../../components/Icon"
import {
  BLUE_COLOR,
  BORDER_COLOR,
  DARKER_TEXT_COLOR,
  DEFAULT_TEXT_COLOR,
  HEADER_HEIGHT,
} from "../../../../components/Styles"
import { LARGE_SCREEN_MEDIA_QUERY } from "../../../../helpers/responsive"
import { escapeRegex } from "../../../../helpers/utility"
import type { Surah } from "../../../../types/surah"
import { QButton } from "../../components/Button"
import { QPopper } from "../../components/Popper"
import { useQuranState } from "../../components/QuranContext"
import { QRightDrawerButton } from "../../components/RightDrawerButton"
import { AL_QURAN, MIN_PAGE_HEIGHT_TO_DISPLAY_FIXED_HEADER } from "../../constants/common"
import { getSurahs } from "../../services/surah"
import { QSurahGrid } from "./components/SurahGrid"
import { QSurahList } from "./components/SurahList"

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

const HomePageContentOptionsContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
`

const HomePageContentViewOptionContainer = styled( Button )`
  align-items: center;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: 400;
  text-transform: none;

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
  max-width: 100%;
  min-height: 100%;
  width: 100%;
`

const HomePageMyBookmarksContainer = styled.div`
  align-items: center;
  border-right: 1px solid ${ BORDER_COLOR };
  display: flex;
  height: 100%;
  padding: 0 15px;
`

const HomePageNoSurahsClearFilterLink = styled.a`
  color: ${ BLUE_COLOR };
  cursor: pointer;
  font-weight: 500;
  margin-top: 30px;
  text-decoration: none;
`

const HomePageNoSurahsPlaceholderContainer = styled.div`
  text-align: center;
`

const HomePageNoSurahsSmallPlaceholderListText = styled.ul`
  font: 400 13px/20px "HarmoniaSansPro";
  list-style-type: none;
  margin: 10px auto;
  max-width: 300px;
  padding-inline-start: 0;
  text-align: left;
`

const HomePageNoSurahsSmallPlaceholderText = styled.div`
  font-size: 13px;
  margin-top: 30px;
`

const HomePageNoSurahsPlaceholderText = styled.div`
  color: ${ DARKER_TEXT_COLOR };
  font-size: 24px;
  font-weight: 400;
  margin-top: 64px;
`

const HomePageRightDrawerButtonContainer = styled.div`
  padding-right: 15px;
`

const HomePageSearchContainer = styled.div`
  align-items: center;
  border: 1px solid ${ BORDER_COLOR };
  border-radius: 48px;
  display: flex;
  flex: 1;
  height: 54px;

  &.fixed {
    background: #ffffff;
    border: none;
    border-bottom: 1px solid ${ BORDER_COLOR };
    border-radius: 0;
    box-shadow: 0px 1px 2px 0px rgb( 60 64 67 / 30% ), 0px 2px 6px 2px rgb( 60 64 67 / 15% );
    height: calc( ${ HEADER_HEIGHT } - 1px );
    left: 0;
    margin: 0;
    position: fixed;
    top: 0;
    z-index: 1000;
  }
`

const HomePageSearchWrapperContainer = styled.div`
  box-sizing: border-box;
  padding: 0 30px 23px 30px;
  width: 100%;
`

const HomePageSearchInput = styled.input`
  border: none;
  caret-color: ${ BLUE_COLOR };
  color: ${ DEFAULT_TEXT_COLOR };
  font-size: 16px;
  font-weight: 500;
  height: 32px;
  width: calc( 100% - 70px );

  &::-moz-placeholder,
  &:-moz-placeholder
  &::placeholder,
  &::-webkit-input-placeholder {
    color: ${ DEFAULT_TEXT_COLOR };
    font-size: 500 16px/24px "HarmoniaSansPro";
    opacity: 1;
  }
`

const HomePageSearchInputContainer = styled.div`
  align-items: center;
  border-right: 1px solid ${ BORDER_COLOR };
  display: flex;
  flex: 1;
  height: 100%;
  min-width: 100px;
  padding-left: 15px;
`

const HomePageSurahsContentContainer = styled.div`
  padding: 15px;
`

const HomePageSurahsGridContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const HomePageSurahsListContainer = styled.div`
  padding: 15px;
`

enum ViewType {
  GRID = "grid",
  LIST = "list",
}

export const HomePage: React.FunctionComponent = () => {
  const MAX_SCROLL_OFFSET = 130

  const { baseClasses, isMobileDevice, isRightDrawerOpen, myBookmarks } = useQuranState()
  const [ isSearchContainerFixed, setIsSearchContainerFixed ] = useState<boolean>( false )
  const [ displayMyBookmarks, setMyDisplayBookmarks ] = useState<boolean>( false )
  const [ popoverMap, setPopoverMap ] = useState<{ [ key: string ]: Element | null }>( {} )
  const [ searchText, setSearchText ] = useState<string>( "" )
  const [ selectViewType, setSelectedViewType ] = useState<ViewType>( ViewType.GRID )
  const [ surahs, setSurahs ] = useState<Surah[]>( getSurahs() )

  useEffectOnce( () => {
    window.scrollTo( 0, 0 )
    window.addEventListener( "scroll", onPageScroll )

    return () => {
      window.removeEventListener( "scroll", onPageScroll )
    }
  } )

  useEffect( () => {
    if( ! searchText && ! displayMyBookmarks ) {
      setSurahs( getSurahs() )
      return
    }

    const regex = searchText ? new RegExp( escapeRegex( searchText ), "i" ) : null
    const filteredSurahs: Surah[] = []

    for( const surah of getSurahs() ) {
      if( regex ) {
        for( const queryIndex of surah.queryIndexes ) {
          if( regex.test( queryIndex )
              && ( ! displayMyBookmarks || myBookmarks.includes( surah.id ) )
          ) {
            filteredSurahs.push( surah )
            break
          }
        }
      } else if( displayMyBookmarks && myBookmarks.includes( surah.id ) ) {
        filteredSurahs.push( surah )
      }
    }

    setSurahs( filteredSurahs )
  }, [ displayMyBookmarks, myBookmarks, searchText ] )

  const clearSearch = useCallback( () => {
    setSearchText( "" )
  }, [] )

  const closePopover = ( key: string ) => {
    setPopoverMap( { ...popoverMap, ...{ [ key ]: null } } )
  }

  const onPageScroll = useCallback( () => {
    if( window.pageYOffset > MAX_SCROLL_OFFSET && document.documentElement.scrollHeight > MIN_PAGE_HEIGHT_TO_DISPLAY_FIXED_HEADER ) {
      setIsSearchContainerFixed( true )
    } else {
      setIsSearchContainerFixed( false )
    }
  }, [] )

  const onSearch = useCallback( ( event: React.ChangeEvent<HTMLInputElement> ) => {
    setSearchText( event.target.value )
  }, [] )

  const openPopover = ( key: string, event: React.MouseEvent<HTMLSpanElement> ) => {
    setPopoverMap( { ...popoverMap, ...{ [ key ]: event.currentTarget } } )
  }

  const resetFilters = useCallback( () => {
    setMyDisplayBookmarks( false )
    setSearchText( "" )
  }, [] )

  const toggleDisplayMyBookmarks = useCallback( () => {
    setMyDisplayBookmarks( ! displayMyBookmarks )
  }, [ displayMyBookmarks ] )

  return (
    <HomePageContainer>
      <Helmet>
        <title>Browse Surahs | The Noble Quran | { AL_QURAN }</title>
      </Helmet>
      <HomePageSearchWrapperContainer>
        <HomePageSearchContainer className={ clsx( baseClasses.header, { "fixed": isSearchContainerFixed, [ baseClasses.headerShift ]: ! isMobileDevice && isSearchContainerFixed && isRightDrawerOpen } ) }>
          <HomePageSearchInputContainer>
            <SearchIcon className={ baseClasses.svgIcon } />
            <HomePageSearchInput autoComplete="false" onChange={ onSearch } placeholder="Search" type="text" value={ searchText } />
            {
              searchText && (
                <HomePageClearIconContainer onClick={ clearSearch } >
                  <ClearIcon className={ baseClasses.svgIcon } />
                </HomePageClearIconContainer>
              )
            }
          </HomePageSearchInputContainer>
          <HomePageMyBookmarksContainer onClick={ toggleDisplayMyBookmarks }>
            {
              isMobileDevice
                ? (
                  <IconButton>
                    <BookmarksIcon className={ clsx( baseClasses.svgIcon, { [ baseClasses.svgIconActive ]: displayMyBookmarks } ) } />
                  </IconButton>
                ) : (
                  <QButton isActive={ displayMyBookmarks } label="My Bookmarks" />
                )
            }
          </HomePageMyBookmarksContainer>
          <IconButton
            className={ baseClasses.iconButton }
            disabled={ ! displayMyBookmarks && ! searchText }
            onClick={ () => resetFilters() }
            onMouseOut={ () => closePopover( "reset" ) }
            onMouseOver={ ( event ) => openPopover( "reset", event ) }
          >
            <RefreshIcon className={ clsx( baseClasses.svgIcon, { [ baseClasses.svgIconDisabled ]: ! displayMyBookmarks && ! searchText } ) } />
            {
              ( displayMyBookmarks || searchText ) && (
                <QPopper
                  anchorEl={ popoverMap[ "reset" ] }
                  open={ Boolean( popoverMap[ "reset" ] ) }
                  text="Reset"
                />
              )
            }
          </IconButton>
          {
            isSearchContainerFixed && (
              <HomePageRightDrawerButtonContainer>
                <QRightDrawerButton />
              </HomePageRightDrawerButtonContainer>
            )
          }
        </HomePageSearchContainer>
      </HomePageSearchWrapperContainer>
      <HomePageMainContainer>
        <HomePageContentContainer>
          <HomePageContentOptionsContainer>
            <div>
              <HomePageContentViewOptionsContainer>
                <HomePageContentViewOptionContainer onClick={ () => setSelectedViewType( ViewType.GRID ) } className={ selectViewType === ViewType.GRID ? "active" : "" }>
                  <GridIcon className={ clsx( baseClasses.svgIcon, "view-option-icon" ) } />
                  <HomePageContentViewOptionContainerLabel className="view-option-label">Grid</HomePageContentViewOptionContainerLabel>
                </HomePageContentViewOptionContainer>
                <HomePageContentViewOptionContainer onClick={ () => setSelectedViewType( ViewType.LIST ) } className={ selectViewType === ViewType.LIST ? "active" : "" }>
                  <ListIcon className={ clsx( baseClasses.svgIcon, "view-option-icon" ) } />
                  <HomePageContentViewOptionContainerLabel className="view-option-label">List</HomePageContentViewOptionContainerLabel>
                </HomePageContentViewOptionContainer>
              </HomePageContentViewOptionsContainer>
            </div>
            <HomePageDisplayNumberContainer>
              { surahs.length } of 114 surahs
            </HomePageDisplayNumberContainer>
          </HomePageContentOptionsContainer>
          <HomePageSurahsContentContainer>
            {
              surahs.length === 0
                ? (
                  <HomePageNoSurahsPlaceholderContainer>
                    <HomePageNoSurahsPlaceholderText>Sorry, we couldn&apos;t find any matches for this search.</HomePageNoSurahsPlaceholderText>
                    <HomePageNoSurahsSmallPlaceholderText>Try another search, or:</HomePageNoSurahsSmallPlaceholderText>
                    <HomePageNoSurahsSmallPlaceholderListText>
                      <li>&#8226;&nbsp;Search by number</li>
                      <li>&#8226;&nbsp;Perhaps you can try searching by surah type</li>
                    </HomePageNoSurahsSmallPlaceholderListText>
                    <HomePageNoSurahsClearFilterLink onClick={ resetFilters }>Clear your filters and try again.</HomePageNoSurahsClearFilterLink>
                  </HomePageNoSurahsPlaceholderContainer>
                ) : (
                  <div>
                    {
                      selectViewType === ViewType.GRID
                        ? (
                          <HomePageSurahsGridContainer>
                            {
                              surahs.map( ( surah ) => (
                                <QSurahGrid key={ surah.id } surah={ surah } />
                              ) )
                            }
                          </HomePageSurahsGridContainer>
                        ) : (
                          <HomePageSurahsListContainer>
                            {
                              surahs.map( ( surah ) => (
                                <QSurahList key={ surah.id } surah={ surah } />
                              ) )
                            }
                          </HomePageSurahsListContainer>
                        )
                    }
                  </div>
                )
            }
          </HomePageSurahsContentContainer>
        </HomePageContentContainer>
      </HomePageMainContainer>
    </HomePageContainer>
  )
}
