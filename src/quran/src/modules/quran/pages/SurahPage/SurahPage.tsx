import Checkbox from "@material-ui/core/Checkbox"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import IconButton from "@material-ui/core/IconButton"
import MenuItem from "@material-ui/core/MenuItem"
import { withStyles } from "@material-ui/core/styles"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { Helmet } from "react-helmet"
import InfiniteScroll from "react-infinite-scroll-component"
import { matchPath, useHistory, useLocation } from "react-router-dom"
import { useClickAway, useEffectOnce } from "react-use"
import styled from "styled-components"

import { ArrowBackIcon, ArrowDownIcon, ArrowUpIcon, RefreshIcon, SearchIcon } from "../../../../components/Icon"
import { BLUE_COLOR, BLUE_COLOR_WITH_OPACITY, BORDER_COLOR, DARK_TEXT_COLOR, DEFAULT_TEXT_COLOR, WHITE_SMOKE_COLOR } from "../../../../components/Styles"
import { logError } from "../../../../helpers/error"
import { LARGE_SCREEN_MEDIA_QUERY } from "../../../../helpers/responsive"
import { escapeRegex, getLanguageLabel, getObjectFromLocalStorage, groupBy, setObjectInLocalStorage } from "../../../../helpers/utility"
import { Ayah } from "../../../../types/ayah"
import { Pagination } from "../../../../types/pagination"
import { Surah } from "../../../../types/surah"
import { Translator } from "../../../../types/translator"
import { QLoader } from "../../components/Loader"
import { QPopper } from "../../components/Popper"
import { SelectedAyahs, useQuranState } from "../../components/QuranContext"
import { AL_QURAN, MIN_PAGE_HEIGHT_TO_DISPLAY_FIXED_HEADER } from "../../constants/common"
import { getSurahs, getSurahAyahs, getTranslatorsGroupedByLanguage } from "../../services/surah"

const MAX_SCROLL_OFFSET = 205

const StyledArrowBackIcon = styled( ArrowBackIcon )`
  fill: ${ DARK_TEXT_COLOR };
`

const StyledArrowDownIcon = styled( ArrowDownIcon )`
  fill: ${ BLUE_COLOR };
`

const StyledArrowUpIcon = styled( ArrowUpIcon )`
  fill: ${ BLUE_COLOR };
`

const StyledFormControlLabel = withStyles( {
  label: {
    "fontSize": "15px",
    "whiteSpace": "normal",
  },
} )( FormControlLabel )

const StyledRefreshIcon = styled( RefreshIcon )`
  fill: ${ DEFAULT_TEXT_COLOR };

  &.disable {
    fill: ${ BORDER_COLOR };
  }
`

const StyledSearchIcon = styled( SearchIcon )`
  fill: ${ DEFAULT_TEXT_COLOR };
`

const LoadingText = styled.div`
  font-weight: 500;
  margin-top: 15px;
  text-align: center;
`

const MenuHeader = styled.div`
  font-size: 12px;
  font-weight: 500;
  padding-top: 15px;
`

const SurahPageErrorBody = styled.div`
  font-size: 16px;
  margin-top: 20px;
  text-align: center;
`

const SurahPageErrorContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc( 100vh - 63px );
  justify-content: center;
  padding: 0 30px;
`

const SurahPageErrorTitle = styled.div`
  font-size: 40px;
  text-align: center;
`

const SurahPageLoadingContainer = styled.div`
  align-items: center;
  display: flex;
  height: calc( 100vh - 63px );
  justify-content: center;
`

const SurahPageContainer = styled.div`
  margin: 0 auto;
  padding: 0 30px 40px 30px;

  @media ${ LARGE_SCREEN_MEDIA_QUERY } {
    max-width: 1440px;
    padding: 0 60px 48px 60px;
  }
`

// Main Container
const SurahPageMainContainer = styled.div`
  box-sizing: border-box;
  max-width: 100%;
`

const SurahPageMainContainerAyahActionsContainer = styled.div`
  align-items: center;
  display: flex;
  margin-top: 30px;
`

const SurahPageMainContainerAyahActionSelect = styled.a`
  cursor: pointer;
  font-weight: 500;

  span {
    color: ${ BLUE_COLOR };
  }
`

const SurahPageMainContainerAyahArabicText = styled.div`
  direction: rtl;
  font-size: 34px;
  margin-bottom: 30px;
  overflow-wrap: break-word;
  text-align: right;

  @media ${ LARGE_SCREEN_MEDIA_QUERY } {
    font-size: 36px;
  }
`

const SurahPageMainContainerAyahContainer = styled.div`
  border-bottom: 1px solid ${ BORDER_COLOR };
  padding: 30px 0;

  &:first-of-type {
    border-top: 1px solid ${ BORDER_COLOR };
  }
`

const SurahPageMainContainerAyahsContainer = styled( InfiniteScroll )`
  display: flex;
  flex-direction: column;
`

const SurahPageMainContainerAyahNumberContainer = styled.div`
  background: ${ WHITE_SMOKE_COLOR };
  border-radius: 4px;
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  padding: 5px;
`

const SurahPageMainContainerAyahTranslationContainer = styled.div`
  & + & {
    margin-top: 15px;
  }
`

const SurahPageMainContainerAyahTranslatedText = styled.div`
  line-height: 1.5;
`

const SurahPageMainContainerAyahTranslatorName = styled.div`
  color: ${ DARK_TEXT_COLOR };
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
`

const SurahPageMainContainerAyahWord = styled.span`
  cursor: pointer;
  position: relative;
`

const SurahPageMainContainerAyahWordContainer = styled.div`
  display: inline;
`

const SurahPageMainContainerHeaderBackIconContainer = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  left: 15px;
  position: fixed;
  top: 40px;
`

const SurahPageMainContainerHeaderBackText = styled.div`
  margin-left: 5px;
  margin-top: 5px;
`

const SurahPageMainContainerBody = styled.div`
  display: flex;
  flex-direction: column;
`

const SurahPageMainContainerHeader = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px 0;

  @media ${ LARGE_SCREEN_MEDIA_QUERY } {
    padding: 30px;
  }

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

const SurahPageMainContainerSettingsButtonContainer = styled.div`
  position: relative;
`

const SurahPageMainContainerSettingsContainer = styled.div`
  align-items: center;
  display: flex;
  margin-top: 10px;
  margin-bottom: 40px;
`

const SurahPageMainContainerSettingsButton = styled.button`
  align-items: center;
  background: transparent;
  border: 1px solid ${ BORDER_COLOR };
  border-radius: 20px;
  display: flex;
  color: ${ DEFAULT_TEXT_COLOR };
  font-size: 15px;
  font-weight: 500;
  min-height: 32px;
  padding: 0 15px;

  &.active {
    background: ${ BLUE_COLOR_WITH_OPACITY };
    border: 1px solid ${ BLUE_COLOR };
    color: ${ BLUE_COLOR };
  }

  &:hover {
    background: ${ WHITE_SMOKE_COLOR };
    color: ${ BLUE_COLOR };
  }

  &:focus {
    background: ${ BLUE_COLOR_WITH_OPACITY };
    border: 1px solid ${ BLUE_COLOR };
    color: ${ BLUE_COLOR };
  }
`

const SurahPageMainContainerTitleContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  text-align: center;
`

const SurahPageMainContainerTitle = styled.div`
  font-family: "QuranKarim";
  font-size: 200px;
  margin-top: -80px;
  margin-bottom: -60px;

  &.fixed {
    font-size: 140px;
    margin-top: -50px;
    margin-bottom: -30px;
  }
`

const SurahPageMainContainerTranslatedTitle = styled.div`
  font-size: 15px;
  margin-top: 10px;
`

const SurahPageMainContainerTransliteratedTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
`

const SurahPageTranslatorsMenu = styled.div`
  background: #ffffff;
  border: 1px solid ${ BORDER_COLOR };
  border-radius: 8px;
  box-shadow: 0 2px 4px -1px rgb( 0 0 0 / 20% ), 0 4px 5px 0 rgb( 0 0 0 / 14% ), 0 1px 10px 0 rgb( 0 0 0 / 12% );
  max-height: 400px;
  min-height: 400px;
  overflow-y: scroll;
  padding: 15px;
  position: absolute;
  top: 40px;
  width: 280px;
  z-index: 10;
`

const SurahPageTranslatorsMenuPlaceholderContainer = styled.div`
  margin-top: 120px;
  text-align: center;
`

const SurahPageTranslatorsMenuSmallPlaceholderText = styled.div`
  font-size: 13px;
  margin-top: 30px;

  ul {
    list-style-type: none;
    padding-inline-start: 0;
  }
`

const SurahPageTranslatorsMenuPlaceholderText = styled.div`
  font-weight: 500;
  margin-top: 15px;
`

const SurahPageTranslatorsSearchInput = styled.input`
  border: none;
  color: ${ DEFAULT_TEXT_COLOR };
  flex: 1;
  font-size: 16px;
  font-weight: 500;

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

const SurahPageTranslatorsSearchInputContainer = styled.div`
  align-items: center;
  border: 1px solid ${ BORDER_COLOR };
  border-radius: 25px;
  display: flex;
  height: 45px;
  outline: none;
  padding: 0 15px;
  margin: 5px 0 10px;
`

const SurahPageTranslatorsSearchInputResetButton = withStyles( {
  root: {
    margin: "0 5px",
  },
} )( IconButton )

const SurahPageTranslatorsSearchInputResetContainer = styled.div`
  border-left: 1px solid ${ BORDER_COLOR };
`

export const SurahPage: React.FunctionComponent = () => {
  const DEFAULT_TRANSLATION = "en.sahih"

  const history = useHistory()
  const location = useLocation()
  const { selectedAyahs, setSelectedAyahs, surahs } = useQuranState()
  const translatorsMenuRef = useRef( null )

  const match = matchPath( location.pathname, "/:id" )
  const id = ( match?.params as { id: string } ).id
  let selectedSurah: Surah = surahs[ id ]


  if( ! selectedSurah ) {
    selectedSurah = getSurahs().find( ( surah ) => surah.query_indexes.includes( id ) ) as Surah

    if( ! selectedSurah ) {
      history.replace( "/" )
      return null
    }
  }

  const [ ayahs, setAyahs ] = useState<Ayah[]>( [] )
  const [ displayError, setDisplayError ] = useState<boolean>( false )
  const [ groupedTranslators, setGroupedTranslators ] = useState<{ [ language: string ]: Translator[] }>( {} )
  const [ filteredGroupedTranslators, setFilteredGroupedTranslators ] = useState<{ [ language: string ]: Translator[] }>( {} )
  const [ hasMore, setHasMore ] = useState( true )
  const [ isLoading, setIsLoading ] = useState<boolean>( true )
  const [ isSurahTitleFixed, setIsSurahTitleFixed ] = useState<boolean>( false )
  const [ pagination, setPagination ] = useState<Pagination | null>( null )
  const [ popoverMap, setPopoverMap ] = useState<{ [ key: string ]: Element | null }>( {} )
  const [ searchText, setSearchText ] = useState<string>( "" )
  const [ selectedTranslations, setSelectedTranslations ] = useState<string[]>( getObjectFromLocalStorage( "translations" ) || [ DEFAULT_TRANSLATION ] )
  const [ displayTranslatorsMenu, setDisplayTranslatorsMenu ] = useState<boolean>( false )

  let regex = searchText ? new RegExp( escapeRegex( searchText ), "i" ) : null

  const translatorNames: { [ identifier: string ]: string } = {}

  useClickAway( translatorsMenuRef, () => {
    if( displayTranslatorsMenu ) {
      setDisplayTranslatorsMenu( false )
    }
  } )

  useEffect( () => {
    getSurahAyahs( selectedSurah.id, { page: 1, per_page: pagination?.page_end || 10, translations: selectedTranslations } )
      .then( ( response ) => {
        const { items, pagination } = response
        setAyahs( [ ...items ] )
        setPagination( { ...pagination } )
      } )
      .catch( ( error ) => {
        setDisplayError( true )
        logError( error )
      } )
      .finally( () => {
        setIsLoading( false )
      } )
  }, [ selectedTranslations ] )

  useEffect( () =>  {
    if( ! regex ) {
      setFilteredGroupedTranslators( groupedTranslators )
      return
    }

    const updatedFilteredGroupedTranslators: { [ language: string ]: Translator[] } = {}

    for( const language in groupedTranslators ) {
      if( groupedTranslators[ language ] ) {
        if( regex.test( getLanguageLabel( language ) ) ) {
          updatedFilteredGroupedTranslators[ language ] = [ ...groupedTranslators[ language ] ]
          continue
        }
        for( const translator of groupedTranslators[ language ] ) {
          if( regex.test( translator.name ) || regex.test( translator.translations[ 0 ].name ) ) {
            if( ! updatedFilteredGroupedTranslators[ language ] ) {
              updatedFilteredGroupedTranslators[ language ] = []
            }

            updatedFilteredGroupedTranslators[ language ].push( translator )
          }
        }
      }
    }

    setFilteredGroupedTranslators( updatedFilteredGroupedTranslators )
  }, [ searchText ] )

  useEffectOnce( () => {
    getTranslatorsGroupedByLanguage()
      .then( ( translators ) => {
        translators.sort( ( a, b ) => {
          const aLanguageLabel = getLanguageLabel( a.language )
          const bLanguageLabel = getLanguageLabel( b.language )

          if( aLanguageLabel < bLanguageLabel ) {
            return -1
          }

          if( aLanguageLabel > bLanguageLabel ) {
            return 1
          }

          return 0
        } )

        const updatedGroupedTranslators = groupBy( translators, "language" )
        setGroupedTranslators( updatedGroupedTranslators )
        setFilteredGroupedTranslators( updatedGroupedTranslators )
      } )
      .catch( ( error ) => {
        setDisplayError( true )
        logError( error )
      } )
  } )

  useEffectOnce( () => {
    window.addEventListener( "scroll", onPageScroll )

    return () => {
      window.removeEventListener( "scroll", onPageScroll )
    }
  } )

  const closePopover = ( key: string ) => {
    setPopoverMap(  { ...popoverMap, ...{ [ key ]: null } } )
  }

  const getTranslationsButtonText = () => {
    if( selectedTranslations.length <= 1 ) {
      return "Translations"
    }

    return `${ getTranslatorName( selectedTranslations[ 0 ] )} +${ selectedTranslations.length - 1 }`
  }

  const getTranslatorName = useCallback( ( identifier: string ) => {
    if( ! groupedTranslators ) {
      return
    }

    const language = identifier.split( "." )[ 0 ]

    if( translatorNames[ identifier ] ) {
      return translatorNames[ identifier ]
    }

    const translators = groupedTranslators[ language ]
    const selectedTranslator = translators?.find( ( translator ) => translator.id === identifier )
    if( ! selectedTranslator ) {
      return null
    }

    translatorNames[ identifier ] = selectedTranslator.translations[ 0 ].name
    return translatorNames[ identifier ]
  }, [ filteredGroupedTranslators ] )

  const loadAyahs = useCallback( () => {
    if( ayahs.length === selectedSurah.number_of_ayahs || ! pagination?.next_page ) {
      setHasMore( false )
      return
    }

    getSurahAyahs( selectedSurah.id, { page: pagination.next_page, per_page: 10, translations: selectedTranslations } )
      .then( ( response ) => {
        const { items } = response
        const updatedAyahs: Ayah[] = [ ...ayahs ]

        for( const ayah of items ) {
          updatedAyahs.push( ayah )
        }

        setAyahs( [ ...ayahs, ...items ] )

        setPagination( { ...pagination, ...response.pagination } )
      } )
      .catch( logError )

  }, [ pagination ] )

  const onClickTranslatorsHandler = useCallback( () => {
    setDisplayTranslatorsMenu( ! displayTranslatorsMenu )
  }, [ displayTranslatorsMenu ] )

  const onPageScroll = useCallback( () => {
    if( window.pageYOffset > MAX_SCROLL_OFFSET && document.documentElement.scrollHeight > MIN_PAGE_HEIGHT_TO_DISPLAY_FIXED_HEADER ) {
      setIsSurahTitleFixed( true )
    } else {
      setIsSurahTitleFixed( false )
    }
  }, [] )

  const openPopover = ( key: string, event: React.MouseEvent<HTMLSpanElement> ) => {
    setPopoverMap(  { ...popoverMap, ...{ [ key ]: event.currentTarget } } )
  }

  const onTranslationToggle = useCallback( ( translator_id: string ) => {
    const updatedSelectedTranslations = [ ...selectedTranslations ]
    const index = updatedSelectedTranslations.indexOf( translator_id )

    if( index !== -1 ) {
      updatedSelectedTranslations.splice( index, 1 )
    } else {
      updatedSelectedTranslations.push( translator_id )
    }

    setObjectInLocalStorage( "translations", updatedSelectedTranslations )
    setSelectedTranslations( updatedSelectedTranslations )
  }, [ selectedTranslations ] )

  const onSearch = useCallback( ( event: React.ChangeEvent<HTMLInputElement> ) => {
    regex = event.target.value ? new RegExp( escapeRegex( event.target.value ), "i" ) : null
    setSearchText( event.target.value )
  }, [] )

  const toggleAyahSelection = ( ayah: Ayah ) => {
    const updatedSelectedAyahs: SelectedAyahs = {
      ...selectedAyahs,
    }

    if( updatedSelectedAyahs[ ayah.id ] ) {
      delete updatedSelectedAyahs[ ayah.id ]
    } else {
      updatedSelectedAyahs[ ayah.id ] = {
        id: ayah.id,
        number_in_surah: ayah.number_in_surah,
        text: ayah.text,
      }
    }

    setSelectedAyahs( updatedSelectedAyahs )
    setObjectInLocalStorage( "selectedAyahs", updatedSelectedAyahs )
  }

  const resetFilters = useCallback( () => {
    setSearchText( "" )
    setSelectedTranslations( [ DEFAULT_TRANSLATION ] )
  }, [] )

  return (
    <div>
      <Helmet>
        <title>{ selectedSurah.transliterations[ 0 ].text } - The Noble Quran - { AL_QURAN }</title>
        <meta name="description" content={ `Surah ${ selectedSurah.transliterations[ 0 ].text }(${ selectedSurah.name }) - ${ selectedSurah.ayahs?.[ 0 ].text.uthmani }` } />
      </Helmet>
      {
          isLoading
          ? (
            <SurahPageLoadingContainer>
              <QLoader />
            </SurahPageLoadingContainer>
          ) : (
            displayError
            ? (
              <SurahPageErrorContainer>
                <SurahPageErrorTitle>We have got something special in store for you.</SurahPageErrorTitle>
                <SurahPageErrorBody>And we can&apos;t wait for you to see it.<br />Please check back soon.</SurahPageErrorBody>
              </SurahPageErrorContainer>
            ) : (
              <SurahPageContainer>
                <SurahPageMainContainer>
                  <SurahPageMainContainerHeader className={ isSurahTitleFixed ? "fixed" : "" }>
                    <SurahPageMainContainerTitleContainer>
                      {
                        isSurahTitleFixed && (
                          <SurahPageMainContainerHeaderBackIconContainer onClick={ () => history.push( "/" ) }>
                            <StyledArrowBackIcon />
                            <SurahPageMainContainerHeaderBackText>Back</SurahPageMainContainerHeaderBackText>
                          </SurahPageMainContainerHeaderBackIconContainer>
                        )
                      }
                      <SurahPageMainContainerTitle dangerouslySetInnerHTML={ { __html: selectedSurah.unicode } } className={ isSurahTitleFixed ? "fixed" : "" } />
                      <SurahPageMainContainerTransliteratedTitle>{ selectedSurah.transliterations[ 0 ].text }</SurahPageMainContainerTransliteratedTitle>
                      <SurahPageMainContainerTranslatedTitle>{ selectedSurah.translations[ 0 ].text } &#8226; { selectedSurah.number_of_ayahs } verses</SurahPageMainContainerTranslatedTitle>
                    </SurahPageMainContainerTitleContainer>
                  </SurahPageMainContainerHeader>
                  <SurahPageMainContainerBody>
                    <SurahPageMainContainerSettingsContainer>
                      <SurahPageMainContainerSettingsButtonContainer>
                        <SurahPageMainContainerSettingsButton
                          aria-controls="translators-menu"
                          aria-haspopup="true"
                          className={ selectedTranslations.length > 1 || displayTranslatorsMenu ? "active" : "" }
                          onClick={ onClickTranslatorsHandler }
                        >
                          { getTranslationsButtonText() }
                          {
                            displayTranslatorsMenu
                            ? (
                              <StyledArrowUpIcon />
                            ) : (
                              <StyledArrowDownIcon />
                            )
                          }
                        </SurahPageMainContainerSettingsButton>
                        {
                          displayTranslatorsMenu && (
                            <SurahPageTranslatorsMenu ref={ translatorsMenuRef }>
                              <SurahPageTranslatorsSearchInputContainer>
                                <StyledSearchIcon />
                                <SurahPageTranslatorsSearchInput autoComplete="false" onChange={ onSearch } placeholder="Search" type="text" value={ searchText }/>
                                <SurahPageTranslatorsSearchInputResetContainer>
                                    <SurahPageTranslatorsSearchInputResetButton
                                      disabled={ selectedTranslations.includes( DEFAULT_TRANSLATION ) && selectedTranslations.length === 1 && ! searchText }
                                      onClick={ () => resetFilters() }
                                    >
                                    <StyledRefreshIcon className={ selectedTranslations.includes( DEFAULT_TRANSLATION ) && selectedTranslations.length === 1 && ! searchText ?  "disable" :  "" } />
                                  </SurahPageTranslatorsSearchInputResetButton>
                                </SurahPageTranslatorsSearchInputResetContainer>
                              </SurahPageTranslatorsSearchInputContainer>
                              {
                                Object.keys( filteredGroupedTranslators ).length
                                ? (
                                  Object.entries( filteredGroupedTranslators ).map( ( [ language, translators ] ) => (
                                    <div key={ language }>
                                      <MenuHeader>{ getLanguageLabel( language ) }</MenuHeader>
                                      {
                                        translators.map( ( translator ) => (
                                          <MenuItem key={ translator.id }>
                                            <StyledFormControlLabel
                                              control={
                                                <Checkbox
                                                  defaultChecked={ selectedTranslations.indexOf( translator.id ) !== -1 }
                                                  checked={ selectedTranslations.indexOf( translator.id ) !== -1 }
                                                  onChange={ () => onTranslationToggle( translator.id ) }
                                                />
                                              }
                                              label={ translator.translations[ 0 ].name }
                                            />
                                          </MenuItem>
                                        ) )
                                      }
                                    </div>
                                  ) )
                                ) : (
                                  <SurahPageTranslatorsMenuPlaceholderContainer>
                                    <SurahPageTranslatorsMenuPlaceholderText>Sorry, we couldn&apos;t find any matches for this search.</SurahPageTranslatorsMenuPlaceholderText>
                                    <SurahPageTranslatorsMenuSmallPlaceholderText>
                                      <div>Try another search, or:</div>
                                      <ul>
                                        <li>&#8226;&nbsp;Perhaps you can try searching by language</li>
                                      </ul>
                                    </SurahPageTranslatorsMenuSmallPlaceholderText>
                                  </SurahPageTranslatorsMenuPlaceholderContainer>
                                )
                              }
                            </SurahPageTranslatorsMenu>
                          )
                        }
                      </SurahPageMainContainerSettingsButtonContainer>
                    </SurahPageMainContainerSettingsContainer>
                    <SurahPageMainContainerAyahsContainer
                      dataLength={ ayahs.length }
                      next={ loadAyahs }
                      hasMore={ hasMore }
                      loader={ <LoadingText>Loading…</LoadingText> }
                    >
                      {
                        ayahs?.map( ( ayah ) => (
                          <SurahPageMainContainerAyahContainer key={ ayah.number }>
                            <SurahPageMainContainerAyahNumberContainer>{ ayah.surah_id }:{ ayah.number_in_surah }</SurahPageMainContainerAyahNumberContainer>
                            <SurahPageMainContainerAyahArabicText className={ `p${ ayah.page }` }>
                              {
                                ayah.words.map( ( word ) => (
                                  <SurahPageMainContainerAyahWordContainer key={ `${ ayah.number_in_surah }_${ word.id }` }>
                                    <SurahPageMainContainerAyahWord
                                      aria-describedby={ `${ ayah.number_in_surah }_${ word.id }` }
                                      onMouseOut={ () => closePopover( `${ ayah.number_in_surah }_${ word.id }` ) }
                                      onMouseOver={ ( event ) => openPopover( `${ ayah.number_in_surah }_${ word.id }`, event ) }
                                    >
                                      { word.text.mushaf }
                                    </SurahPageMainContainerAyahWord>
                                    {
                                      word.translations[ 0 ].text && (
                                        <QPopper
                                          anchorEl={ popoverMap[ `${ ayah.number_in_surah }_${ word.id }` ] }
                                          id={ `${ ayah.number_in_surah }_${ word.id }` }
                                          open={ Boolean( popoverMap[ `${ ayah.number_in_surah }_${ word.id }` ] ) }
                                          text={ word.translations[ 0 ].text }
                                        />
                                      )
                                    }
                                  </SurahPageMainContainerAyahWordContainer>
                                ) )
                              }
                            </SurahPageMainContainerAyahArabicText>
                            {
                              ayah.translations && Object.keys( ayah.translations ).map( ( identifier ) => (
                                <SurahPageMainContainerAyahTranslationContainer key={ identifier }>
                                  <SurahPageMainContainerAyahTranslatorName>{ getTranslatorName( identifier ) }</SurahPageMainContainerAyahTranslatorName>
                                  <SurahPageMainContainerAyahTranslatedText>{ ayah.translations?.[ identifier ] }</SurahPageMainContainerAyahTranslatedText>
                                </SurahPageMainContainerAyahTranslationContainer>
                              ) )
                            }
                            <SurahPageMainContainerAyahActionsContainer>
                              <SurahPageMainContainerAyahActionSelect onClick={ () => toggleAyahSelection( ayah ) }>
                                {
                                  selectedAyahs[ ayah.id ]
                                  ? (
                                    <span>&#8211; Remove this verse</span>
                                  ) : (
                                    <span>&#43; Select this verse</span>
                                  )
                                }
                              </SurahPageMainContainerAyahActionSelect>
                            </SurahPageMainContainerAyahActionsContainer>
                          </SurahPageMainContainerAyahContainer>
                        ) )
                      }
                    </SurahPageMainContainerAyahsContainer>
                  </SurahPageMainContainerBody>
                </SurahPageMainContainer>
              </SurahPageContainer>
            )
          )
        }
    </div>
  )
}
