import React, { useState } from "react"
import { Helmet } from "react-helmet"
import { matchPath, useHistory, useLocation } from "react-router-dom"
import { useEffectOnce } from "react-use"
import styled from "styled-components"

import { ClearIcon, SearchIcon } from "../../../../components/Icon"
import { BLUE_COLOR, BLUE_COLOR_WITH_OPACITY, BORDER_COLOR, DARK_BLUE_COLOR, DEFAULT_TEXT_COLOR, WHITE_SMOKE_COLOR } from "../../../../components/Styles"
import { escapeRegex } from "../../../../helpers/utility"
import { getSurahAyahs, getSurahs } from "../../services/surah"
import { Ayah } from "../../../../types/ayah"
import { Surah } from "../../../../types/surah"


const SurahContainer = styled.div`
  border-top: 1px solid ${ BORDER_COLOR };
  color: ${ DEFAULT_TEXT_COLOR };
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  padding: 30px 15px;

  &:hover {
    background: ${ WHITE_SMOKE_COLOR };
    transform: translateY( -1px );

    &.active {
      background: ${ BLUE_COLOR_WITH_OPACITY };

      div {
        color: ${ DARK_BLUE_COLOR };
      }
    }
  }
`

const SurahDetailsContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
`

const SearchInput = styled.input`
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

const SurahNumberTextContainer = styled.div`
  font-size: 13px;
  font-weight: 400;
  padding-bottom: 5px;
  padding-left: 15px;
`

const SurahPageContainer = styled.div`
  display: flex;
`

const SurahPageAyahsContainer = styled.div`
`

const SurahPageAyahContainer = styled.div`
`

const SurahPageArabicContainer = styled.div`
`

const SurahPageArabicText = styled.div`
  direction: rtl;
  font-size: 30px;
  overflow-wrap: break-word;
  padding-right: 15px;
  text-align: right;
`

const SurahPageMainContainer = styled.div`
  flex: 1;
`

const SurahPageSideContainer = styled.div`
  border-right: 1px solid ${ BORDER_COLOR };
  height: calc( 100vh - 63px );
  max-height: calc( 100vh - 63px );
  overflow-y: auto;
  width: 340px;
`

const SurahSearchBarContainer = styled.div`
  align-items: center;
  border: 1px solid ${ BORDER_COLOR };
  border-radius: 48px;
  display: flex;
  height: 54px;
  margin: 15px;
  padding-left: 15px;
`

const SurahSearchClearIconContainer = styled.a`
  height: 24px;
  text-decoration: none;
`

const SurahTitleText = styled.div`
  font-family: "QuranKarim";
  font-size: 80px;
  margin-top: -40px;

  &.active {
    color: ${ BLUE_COLOR };
  }
`

const SurahTransliteratedText = styled.div`
  font-size: 16px;
  font-weight: 500;

  &.active {
    color: ${ BLUE_COLOR };
  }
`

const SurahTranslatedText = styled.div`
  font-size: 15px;
  font-weight: 400;
  margin-top: 10px;

  &.active {
    color: ${ BLUE_COLOR };
  }
`


// eslint-disable-next-line space-in-parens
const StyledClearIcon = styled(ClearIcon)`
  fill: ${ DEFAULT_TEXT_COLOR };
`

// eslint-disable-next-line space-in-parens
const StyledSearchIcon = styled(SearchIcon)`
  fill: ${ DEFAULT_TEXT_COLOR };
`

export const SurahPage: React.FunctionComponent = () => {
  const history = useHistory()
  const location = useLocation()
  const [ searchText, setSearchText ] = useState<string>( "" )
  const [ surah, setSurah ] = useState<{ ayahs: Ayah[] }>( { ayahs: [] } )
  const [ surahs, setSurahs ] = useState<Surah[]>( getSurahs() )

  let id: string
  let regex = searchText ? new RegExp( escapeRegex( searchText ), "i" ) : null

  const match = matchPath( location.pathname, "/:id" )

  if( match ) {
    id = ( match.params as { id: string } ).id
  }

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

  const onSearch = ( event: React.ChangeEvent<HTMLInputElement> ) => {
    regex = event.target.value ? new RegExp( escapeRegex( event.target.value ), "i" ) : null
    setSearchText( event.target.value )
    filterSurahs()
  }

  const readSurah = ( selectedId: string ) => {
    if( selectedId === id ) {
      return
    }

    history.push( `/${ selectedId }` )
  }

  useEffectOnce( () => {
    getSurahAyahs( id )
      .then( ( response ) => {
        setSurah( { ayahs: [ ...surah.ayahs, ...response.items ] } )
      } )
  } )

  return (
    // <SurahPageContainer>
    //   <SurahPageAyahsContainer>
    //     {
    //       surah.ayahs.map( ( ayah ) => (
    //         <SurahPageAyahContainer key={ ayah.id }>
    //           <SurahPageArabicContainer>
    //             <SurahPageArabicText className={ `p${ ayah.page }` }>{ ayah.text.mushaf }</SurahPageArabicText>
    //           </SurahPageArabicContainer>
    //         </SurahPageAyahContainer>
    //       ) )
    //     }
    //   </SurahPageAyahsContainer>
    // </SurahPageContainer>
    <div>
      <SurahPageContainer>
        <SurahPageSideContainer>
          <SurahSearchBarContainer>
            <StyledSearchIcon />
            <SearchInput autoComplete="false" onChange={ onSearch } placeholder="Search" type="text" value={ searchText } />
            {
              searchText && (
                <SurahSearchClearIconContainer onClick={ clearSearch } >
                  <StyledClearIcon />
                </SurahSearchClearIconContainer>
              )
            }
          </SurahSearchBarContainer>
          <SurahNumberTextContainer>{ surahs.length } of 114 surahs</SurahNumberTextContainer>
          {
            surahs.map( ( surah ) => (
              <SurahContainer key={ surah.id } className={ surah.id === id ? "active" : "" } onClick={ () => readSurah( surah.id ) }>
                <SurahDetailsContainer>
                  <SurahTransliteratedText className={ surah.id === id ? "active" : "" }>{ surah.number } &#8226; { surah.transliterations[ 0 ].text }</SurahTransliteratedText>
                  <SurahTranslatedText className={ surah.id === id ? "active" : "" }>{ surah.translations[ 0 ].text } &#8226; { surah.number_of_ayahs } verses</SurahTranslatedText>
                </SurahDetailsContainer>
                <SurahTitleText className={ surah.id === id ? "active" : "" } dangerouslySetInnerHTML={ { __html: surah.unicode } }></SurahTitleText>
              </SurahContainer>
            ) )
          }
        </SurahPageSideContainer>
        <SurahPageMainContainer>

        </SurahPageMainContainer>
      </SurahPageContainer>
    </div>
  )
}