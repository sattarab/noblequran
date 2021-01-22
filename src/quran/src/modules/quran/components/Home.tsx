import React, { useState } from "react"
import styled from "styled-components"

import { FavoriteIcon, GridIcon, ListIcon } from "../../../components/Icon"
import { BACKGROUND_COLOR, BORDER_COLOR, DEFAULT_TEXT_COLOR, PRIMARY_TEAL_COLOR, SECONDARY_TEAL_COLOR } from "../../../components/Styles"
import { escapeRegex } from "../../../helpers/utility"
import { getSurahs } from "../services/surah"
import { Option } from "../../../types/option"
import { Surah } from "../../../types/surah"

const HomePageContainer = styled.div`
`

const HomePageContentOptionsContainer = styled.div`
  align-items: center;
  display: flex;
  height: 100px;
  justify-content: space-between;
  padding: 0 30px;
`

const HomePageContentOptionContainer = styled.div`
  height: 64px;
`

const HomePageContentOptionLabel = styled.div`
  font-family: "GothamRounded";
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 10px;
`

const HomePageContentViewOptionsContainer = styled.div`
  align-items: center;
  display: flex;
`

const HomePageContentViewOptionContainer = styled.div`
  align-items: center;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 15px;

  & + & {
    margin-left: 20px;
  }
`

const HomePageContentViewOptionContainerLabel = styled.div`
  margin-left: 5px;
`

const HomePageContentContainer = styled.div`
  background: ${ BACKGROUND_COLOR };
  flex: 1;
`

const HomePageDivisionTypeTab = styled.div`
  color: ${ DEFAULT_TEXT_COLOR };
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  opacity: 0.3;

  & + & {
    margin-left: 30px;
  }
`

const HomePageDivisionTypeTabsContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
`

const HomePageMainContainer = styled.div`
  display: flex;
  min-height: 100%;
  width: 100%;
  max-width: 100%;
`

const HomePageSurahsContentContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 15px 0 15px 15px;
`

const HomePageSurahGridContainer = styled.div`
  box-sizing: border-box;
  flex: 0 1 25%;
  height: 338px;
  padding: 15px;
`

const HomePageSurahGridInnerContainer = styled.div`
  border: 1px solid ${ BORDER_COLOR };
  border-radius: 8px;
  cursor: pointer;
  height: 100%;

  &:hover {
    border: 1px solid ${ DEFAULT_TEXT_COLOR };
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
  color: ${ PRIMARY_TEAL_COLOR };
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

const HomePageSurahGridDetailsText = styled.div`
  font-size: 14px;
  font-weight: 500;
  padding-top: 5px;
`

const HomePageSurahFavoriteContainer = styled.div`
`

const HomePageSurahGridReadSurahButton = styled.button`
  background: #ffffff;
  border: 2px solid ${ SECONDARY_TEAL_COLOR };
  border-radius: 25px;
  color: ${ SECONDARY_TEAL_COLOR };
  cursor: pointer;
  height: 32px;
  font-size: 14px;
  font-weight: 500;
  padding: 0 15px;

  &:hover {
    background: ${ SECONDARY_TEAL_COLOR };
    color: #ffffff;
  }
`

const HomePageSurahGridTranslatedText = styled.div`
  color: ${ SECONDARY_TEAL_COLOR };
  font-size: 14px;
  font-weight: 500;
  margin-top: -30px;
`

const HomePageSurahGridTransliteratedText = styled.div`
  font-size: 16px;
  font-weight: 700;
`

enum DivisionType {
  JUZ = "juz",
  SURAH = "surah",
}

enum RevelationPlace {
  ALL = "all",
  MECCAN = "meccan",
  MEDINAN = "medinan",
}

enum ViewType {
  GRID = "grid",
  LIST = "list",
}

export const Home: React.FunctionComponent = () => {
  const [ filterToggleMap, setFilterToggleMap ] = useState<{ [ key: string ]: boolean }>( { "favorites": true, "revelationPlace": true } )
  const [ displayFilterSection, setDisplayFilterSection ] = useState<boolean>( true )
  const [ selectDivisionType, setSelectDivisionType ] = useState<DivisionType>( DivisionType.SURAH )
  const [ selectedRevelationPlace, setSelectedRevelationPlace ] = useState<RevelationPlace>( RevelationPlace.ALL )
  const [ selectViewType, setSelectedViewType ] = useState<ViewType>( ViewType.GRID )
  const [ searchText, setSearchText ] = useState<string | null>( null )
  const [ surahs, setSurahs ] = useState<Surah[]>( getSurahs() )

  const sortOptions: Array<Option<string>> = [
    {
      label: "Book Order",
      value: "book",
    },
    {
      label: "Revelation Order",
      value: "revelation",
    },
    {
      label: "Alphabetically",
      value: "alphabetically",
    },
  ]

  let regex = searchText ? new RegExp( escapeRegex( searchText ), "i" ) : null
  let revelationPlace = selectedRevelationPlace

  const filterSurahs = () => {
    if( ! regex && revelationPlace === RevelationPlace.ALL ) {
      setSurahs( getSurahs() )
      return
    }

    const filteredSurahs: Surah[] = []

    for( const surah of getSurahs() ) {
      if( regex ) {
        for( const queryIndex of surah.query_indexes ) {
          if( regex.test( queryIndex ) ) {
            if( revelationPlace === RevelationPlace.ALL || revelationPlace === surah.revelation.place ) {
              filteredSurahs.push( surah )
            }
            break
          }
        }
      } else if( revelationPlace === RevelationPlace.ALL || revelationPlace === surah.revelation.place ) {
        filteredSurahs.push( surah )
      }
    }

    setSurahs( filteredSurahs )
  }

  const getSelectedDivisionTypeStyles = ( type: DivisionType ): React.CSSProperties => {
    if( type !== selectDivisionType ) {
      return {}
    }

    return {
      borderBottom: `2px solid ${ PRIMARY_TEAL_COLOR }`,
      fontWeight: 700,
      opacity: 1,
    }
  }

  const getSelectedViewTypeStyles = ( type: string ): React.CSSProperties => {
    if( type !== selectViewType ) {
      return {}
    }

    return {
      background: BORDER_COLOR,
      fontWeight: 700,
    }
  }

  const onRevelationPlaceChange = ( event: React.ChangeEvent<HTMLInputElement> ) => {
    revelationPlace = event.target.value as RevelationPlace
    setSelectedRevelationPlace( revelationPlace )
    filterSurahs()
  }

  const onSearch = ( event: React.ChangeEvent<HTMLInputElement> ) => {
    regex = event.target.value ? new RegExp( escapeRegex( event.target.value ), "i" ) : null
    setSearchText( event.target.value )
    filterSurahs()
  }

  const toggleDisplayFilterOptions = ( key: string ) => {
    const updatedFilterToggleMap = {
      ...filterToggleMap,
    }
    updatedFilterToggleMap[ key ] = ! filterToggleMap[ key ]
    setFilterToggleMap( updatedFilterToggleMap )
  }

  const toggleDisplayFilterSection = () => {
    setDisplayFilterSection( ! displayFilterSection )
  }

  return (
    <HomePageContainer>
      <HomePageMainContainer>
        <HomePageContentContainer>
          <HomePageDivisionTypeTabsContainer>
            <HomePageDivisionTypeTab onClick={ () => setSelectDivisionType( DivisionType.SURAH ) } style={ getSelectedDivisionTypeStyles( DivisionType.SURAH ) }>Surah</HomePageDivisionTypeTab>
            <HomePageDivisionTypeTab onClick={ () => setSelectDivisionType( DivisionType.JUZ ) } style={ getSelectedDivisionTypeStyles( DivisionType.JUZ ) }>Juz</HomePageDivisionTypeTab>
          </HomePageDivisionTypeTabsContainer>
          <HomePageContentOptionsContainer>
            <HomePageContentOptionContainer>
              <HomePageContentOptionLabel>View</HomePageContentOptionLabel>
              <HomePageContentViewOptionsContainer>
                <HomePageContentViewOptionContainer onClick={ () => setSelectedViewType( ViewType.GRID ) } style={ getSelectedViewTypeStyles( ViewType.GRID ) }>
                  <GridIcon />
                  <HomePageContentViewOptionContainerLabel>Grid</HomePageContentViewOptionContainerLabel>
                </HomePageContentViewOptionContainer>
                <HomePageContentViewOptionContainer onClick={ () => setSelectedViewType( ViewType.LIST ) } style={ getSelectedViewTypeStyles( ViewType.LIST ) }>
                  <ListIcon />
                  <HomePageContentViewOptionContainerLabel>List</HomePageContentViewOptionContainerLabel>
                </HomePageContentViewOptionContainer>
              </HomePageContentViewOptionsContainer>
            </HomePageContentOptionContainer>
          </HomePageContentOptionsContainer>
          <HomePageSurahsContentContainer>
            {
              selectViewType === ViewType.GRID
              ? (
                surahs.map( ( surah ) => (
                  <HomePageSurahGridContainer key={ surah.id }>
                    <HomePageSurahGridInnerContainer>
                      <HomePageSurahGridTitleContainer>
                        <HomePageSurahGridTitleText dangerouslySetInnerHTML={ { __html: surah.unicode } } />
                        <HomePageSurahGridTranslatedText>{ surah.translations[ 0 ].text }</HomePageSurahGridTranslatedText>
                      </HomePageSurahGridTitleContainer>
                      <HomePageSurahGridDetailsContainer>
                        <HomePageSurahGridTransliteratedText>{ surah.number } &#8226; { surah.transliterations[ 0 ].text }</HomePageSurahGridTransliteratedText>
                        <HomePageSurahGridDetailsText>{ surah.number_of_ayahs } verses &#8226; { surah.revelation.place }</HomePageSurahGridDetailsText>
                      </HomePageSurahGridDetailsContainer>
                      <HomePageSurahGridFooterContainer>
                        <HomePageSurahFavoriteContainer>
                          <FavoriteIcon />
                        </HomePageSurahFavoriteContainer>
                        <HomePageSurahGridReadSurahButton>Read</HomePageSurahGridReadSurahButton>
                      </HomePageSurahGridFooterContainer>
                    </HomePageSurahGridInnerContainer>
                  </HomePageSurahGridContainer>
                ) )
              ) : (
                <div>List</div>
              )
            }
          </HomePageSurahsContentContainer>
        </HomePageContentContainer>
      </HomePageMainContainer>
    </HomePageContainer>
  )
}