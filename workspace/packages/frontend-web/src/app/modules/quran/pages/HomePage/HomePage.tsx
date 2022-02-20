import styled from "@emotion/styled"
import Button from "@material-ui/core/Button"
import clsx from "clsx"
import React, { useCallback, useState } from "react"
import { Helmet } from "react-helmet"
import { useEffectOnce } from "react-use"

import { GridIcon, ListIcon } from "../../../../components/Icon"
import { BLUE_COLOR, DARKER_TEXT_COLOR } from "../../../../components/Styles"
import { LARGE_SCREEN_MEDIA_QUERY } from "../../../../helpers/responsive"
import { getItemFromStorage } from "../../../../helpers/utility"
import { useAppDispatch, useAppSelector } from "../../../../hooks"
import { useQuranState } from "../../components/QuranContext"
import { ScrollUpButton } from "../../components/ScrollUpButton"
import { AL_QURAN } from "../../constants/common"
import { trackMixpanelEvent } from "../../services/mixpanel"
import { SearchBar } from "./components/SearchBar"
import { SurahGrid } from "./components/SurahGrid"
import { SurahList } from "./components/SurahList"
import { reset, setBookmarks } from "./state/home"

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
  margin-top: 15px;
`

const HomePageNoSurahsPlaceholderText = styled.div`
  color: ${ DARKER_TEXT_COLOR };
  font-size: 24px;
  font-weight: 400;
  margin-top: 64px;
`

const HomePageSearchWrapperContainer = styled.div`
  box-sizing: border-box;
  padding: 0 30px 23px 30px;
  width: 100%;
`

const HomePageSurahsContentContainer = styled.div`
  padding: 15px;
`

enum ViewType {
  GRID = "grid",
  LIST = "list",
}

export const HomePage: React.FunctionComponent = () => {
  const dispatch = useAppDispatch()
  const isHeaderFixed = useAppSelector( ( state ) => state.home.isHeaderFixed )
  const surahs = useAppSelector( ( state ) => state.home.surahs )

  const { baseClasses } = useQuranState()
  const [ selectViewType, setSelectedViewType ] = useState<ViewType>( ViewType.GRID )

  useEffectOnce( () => {
    trackMixpanelEvent( "Page Opened", { Name: "Home" } )

    getItemFromStorage<string[]>( "surahBookmarks" )
      .then( ( storedBookmarks ) => {
        if( storedBookmarks ) {
          dispatch( setBookmarks( storedBookmarks ) )
        }
      } )
  } )

  const resetFilters = useCallback( () => {
    dispatch( reset() )
  }, [ dispatch ] )

  return (
    <HomePageContainer>
      <Helmet>
        <title>Browse Surahs | The Noble Quran | { AL_QURAN }</title>
      </Helmet>
      <HomePageSearchWrapperContainer>
        <SearchBar />
      </HomePageSearchWrapperContainer>
      <HomePageMainContainer>
        <HomePageContentContainer>
          <HomePageContentOptionsContainer>
            <HomePageContentViewOptionsContainer>
              <HomePageContentViewOptionContainer onClick={ () => setSelectedViewType( ViewType.GRID ) } className={ clsx( { "active": selectViewType === ViewType.GRID } ) } >
                <GridIcon className={ clsx( baseClasses.svgIcon, "view-option-icon" ) } />
                <HomePageContentViewOptionContainerLabel className="view-option-label">Grid</HomePageContentViewOptionContainerLabel>
              </HomePageContentViewOptionContainer>
              <HomePageContentViewOptionContainer onClick={ () => setSelectedViewType( ViewType.LIST ) } className={ selectViewType === ViewType.LIST ? "active" : "" }>
                <ListIcon className={ clsx( baseClasses.svgIcon, "view-option-icon" ) } />
                <HomePageContentViewOptionContainerLabel className="view-option-label">List</HomePageContentViewOptionContainerLabel>
              </HomePageContentViewOptionContainer>
            </HomePageContentViewOptionsContainer>
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
                    <HomePageNoSurahsClearFilterLink onClick={ resetFilters }>Clear your filters and try again</HomePageNoSurahsClearFilterLink>
                  </HomePageNoSurahsPlaceholderContainer>
                ) : (
                  selectViewType === ViewType.GRID
                    ? (
                      <SurahGrid />
                    ) : (
                      <SurahList />
                    )
                )
            }
          </HomePageSurahsContentContainer>
        </HomePageContentContainer>
      </HomePageMainContainer>
      {
        isHeaderFixed && (
          <ScrollUpButton />
        )
      }
    </HomePageContainer>
  )
}
