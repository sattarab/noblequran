import styled from "@emotion/styled"
import { IconButton } from "@material-ui/core"
import clsx from "clsx"
import React, { memo, useCallback, useState } from "react"
import { useEffectOnce } from "react-use"

import { BookmarksIcon, ClearIcon, RefreshIcon, SearchIcon } from "../../../../../components/Icon"
import { BLUE_COLOR, BORDER_COLOR, DEFAULT_TEXT_COLOR, HEADER_HEIGHT, MIN_PAGE_HEIGHT_TO_DISPLAY_FIXED_HEADER } from "../../../../../components/Styles"
import { useAppDispatch, useAppSelector } from "../../../../../hooks"
import { QButton } from "../../../components/Button"
import { QPopper } from "../../../components/Popper"
import { useQuranState } from "../../../components/QuranContext"
import { QRightDrawerButton } from "../../../components/RightDrawerButton"
import { reset, search, setIsHeaderFixed, toggleDisplayBookmarks } from "../state/home"

const HomePageMyBookmarksContainer = styled.div`
  align-items: center;
  border-right: 1px solid ${ BORDER_COLOR };
  display: flex;
  height: 100%;
  padding: 0 15px;
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

const SearchBarFunction: React.FunctionComponent = () => {
  const MAX_SCROLL_OFFSET = 130

  const dispatch = useAppDispatch()
  const displayBookmarks = useAppSelector( ( state ) => state.home.displayBookmarks )
  const isHeaderFixed = useAppSelector( ( state ) => state.home.isHeaderFixed )
  const isRightDrawerOpen = useAppSelector( ( state ) => state.quran.isRightDrawerOpen )
  const searchText = useAppSelector( ( state ) => state.home.searchText )

  const { baseClasses, isMobileDevice } = useQuranState()
  const [ popoverMap, setPopoverMap ] = useState<{ [ key: string ]: Element | null }>( {} )

  const resetFilters = useCallback( () => {
    dispatch( reset() )
  }, [ dispatch ] )

  useEffectOnce( () => {
    window.scrollTo( 0, 0 )
    window.addEventListener( "scroll", onPageScroll )

    return () => {
      window.removeEventListener( "scroll", onPageScroll )
    }
  } )

  const clearSearch = useCallback( () => {
    dispatch( search( "" ) )
  }, [ dispatch ] )

  const closePopover = ( key: string ) => {
    setPopoverMap( { ...popoverMap, ...{ [ key ]: null } } )
  }

  const onPageScroll = useCallback( () => {
    if( window.pageYOffset > MAX_SCROLL_OFFSET && document.documentElement.scrollHeight > MIN_PAGE_HEIGHT_TO_DISPLAY_FIXED_HEADER ) {
      dispatch( setIsHeaderFixed( true ) )
    } else {
      dispatch( setIsHeaderFixed( false ) )
    }
  }, [ dispatch ] )

  const onSearch = useCallback( ( event: React.ChangeEvent<HTMLInputElement> ) => {
    dispatch( search( event.target.value ) )
  }, [ dispatch ] )

  const openPopover = useCallback( ( key: string, event: React.MouseEvent<HTMLSpanElement> ) => {
    setPopoverMap( { ...popoverMap, ...{ [ key ]: event.currentTarget } } )
  }, [ popoverMap ] )

  const toggledisplayBookmarks = useCallback( () => {
    dispatch( toggleDisplayBookmarks() )
  }, [ dispatch ] )

  return (
    <HomePageSearchContainer className={ clsx( baseClasses.header, { "fixed": isHeaderFixed, [ baseClasses.headerShift ]: ! isMobileDevice && isHeaderFixed && isRightDrawerOpen } ) }>
      <HomePageSearchInputContainer>
        <SearchIcon className={ baseClasses.svgIcon } />
        <HomePageSearchInput autoComplete="false" onChange={ onSearch } placeholder="Search" type="text" value={ searchText } />
        {
          searchText && (
            <IconButton onClick={ clearSearch }>
              <ClearIcon className={ baseClasses.svgIcon } />
            </IconButton>
          )
        }
      </HomePageSearchInputContainer>
      <HomePageMyBookmarksContainer onClick={ toggledisplayBookmarks }>
        {
          isMobileDevice
            ? (
              <IconButton>
                <BookmarksIcon className={ clsx( baseClasses.svgIcon, { [ baseClasses.svgIconActive ]: displayBookmarks } ) } />
              </IconButton>
            ) : (
              <QButton isActive={ displayBookmarks } label="My Bookmarks" />
            )
        }
      </HomePageMyBookmarksContainer>
      <IconButton
        className={ baseClasses.iconButton }
        disabled={ ! displayBookmarks && ! searchText }
        onClick={ resetFilters }
        onMouseOut={ () => closePopover( "reset" ) }
        onMouseOver={ ( event ) => openPopover( "reset", event ) }
      >
        <RefreshIcon className={ clsx( baseClasses.svgIcon, { [ baseClasses.svgIconDisabled ]: ! displayBookmarks && ! searchText } ) } />
        {
          ( displayBookmarks || searchText ) && (
            <QPopper
              anchorEl={ popoverMap[ "reset" ] }
              open={ Boolean( popoverMap[ "reset" ] ) }
              text="Reset"
            />
          )
        }
      </IconButton>
      {
        isHeaderFixed && (
          <HomePageRightDrawerButtonContainer>
            <QRightDrawerButton />
          </HomePageRightDrawerButtonContainer>
        )
      }
    </HomePageSearchContainer>
  )
}

export const SearchBar = memo( SearchBarFunction )
