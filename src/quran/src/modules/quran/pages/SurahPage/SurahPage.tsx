import React, { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import { matchPath, useHistory, useLocation } from "react-router-dom"
import { useEffectOnce } from "react-use"
import styled from "styled-components"

import { ArrowDownIcon } from "../../../../components/Icon"
import { BLUE_COLOR, BLUE_COLOR_WITH_OPACITY, BORDER_COLOR, DEFAULT_TEXT_COLOR, WHITE_SMOKE_COLOR } from "../../../../components/Styles"
import { LARGE_SCREEN_MEDIA_QUERY } from "../../../../helpers/responsive"
import { Surah } from "../../../../types/surah"
import { QLoader } from "../../components/Loader"
import { useQuranState } from "../../components/QuranContext"
import { AL_QURAN } from "../../constants/common"
import { getSurahAyahs } from "../../services/surah"

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

const SurahPageMainContainerAyahArabicText = styled.div`
  direction: rtl;
  font-size: 34px;
  margin-bottom: 30px;
  overflow-wrap: break-word;
  text-align: right;

  @media ${ LARGE_SCREEN_MEDIA_QUERY } {
    font-size: 40px;
  }
`

const SurahPageMainContainerAyahTranslatedText = styled.div`
`

const SurahPageMainContainerAyahContainer = styled.div`
  border-bottom: 1px solid ${ BORDER_COLOR };
  padding: 15px 0;

  &:first-of-type {
    border-top: 1px solid ${ BORDER_COLOR };
  }
`

const SurahPageMainContainerAyahsContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const SurahPageMainContainerBody = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
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
    padding: 15px;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 100;
  }
`

const SurahPageMainContainerSettingsContainer = styled.div`
  align-items: center;
  display: flex;
  margin-top: 10px;
`

const SurahPageMainContainerSettingsContainerButton = styled.button`
  align-items: center;
  background: transparent;
  border: 1px solid ${ BORDER_COLOR };
  border-radius: 20px;
  display: flex;
  color: ${ DEFAULT_TEXT_COLOR };
  font-size: 16px;
  font-weight: 500;
  min-height: 32px;
  padding: 0 15px;

  &:hover {
    background: ${ WHITE_SMOKE_COLOR };
    color: ${ BLUE_COLOR };
  }

  &:focus {
    background: ${ BLUE_COLOR_WITH_OPACITY };
    border: 1px solid ${ BLUE_COLOR };
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

const StyledArrowDownIcon = styled( ArrowDownIcon )`
  fill: ${ BLUE_COLOR };
`

export const SurahPage: React.FunctionComponent = () => {
  const MAX_SCROLL_OFFSET = 225

  const history = useHistory()
  const location = useLocation()
  const { surahs } = useQuranState()

  const match = matchPath( location.pathname, "/:id" )
  const id = ( match?.params as { id: string } ).id
  const selectedSurah = surahs[ id ]

  if( ! selectedSurah ) {
    history.replace( "/" )
    return null
  }

  const [ displayError, setDisplayError ] = useState<boolean>( false )
  const [ isSurahTitleFixed, setIsSurahTitleFixed ] = useState<boolean>( false )
  const [ isLoading, setIsLoading ] = useState<boolean>( true )
  const [ surah, setSurah ] = useState<Surah>( selectedSurah )

  const onPageScroll = () => {
    if( window.pageYOffset > MAX_SCROLL_OFFSET ) {
      setIsSurahTitleFixed( true )
    } else {
      setIsSurahTitleFixed( false )
    }
  }

  useEffect( () => {
    getSurahAyahs( id, { page: 1, per_page: 7, embeds: [ "translations" ] } )
      .then( ( response ) => {
        const updatedSurah = {
          ...surah,
          ayahs: [ ...( surah.ayahs ?? [] ) ],
        }

        for( const ayah of response.items ) {
          if( updatedSurah.ayahs.findIndex( ( surahAyah ) => surahAyah.id === ayah.id ) === -1 ) {
            updatedSurah.ayahs.push( ayah )
          }
        }

        setSurah( updatedSurah )
      } )
      .catch( () => {
        setDisplayError( true )
      } )
      .finally( () => {
        setIsLoading( false )
      } )
  }, [ surah.id ] )

  useEffectOnce( () => {
    window.addEventListener( "scroll", onPageScroll )

    return () => {
      window.removeEventListener( "scroll", onPageScroll )
    }
  } )

  return (
    <div>
      <Helmet>
        <title>{ surah.transliterations[ 0 ].text } - The Noble Quran - { AL_QURAN }</title>
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
                      <SurahPageMainContainerTitle dangerouslySetInnerHTML={ { __html: surah.unicode } } className={ isSurahTitleFixed ? "fixed" : "" } />
                      <SurahPageMainContainerTransliteratedTitle>{ surah.transliterations[ 0 ].text }</SurahPageMainContainerTransliteratedTitle>
                      <SurahPageMainContainerTranslatedTitle>{ surah.translations[ 0 ].text } &#8226; { surah.number_of_ayahs } verses</SurahPageMainContainerTranslatedTitle>
                    </SurahPageMainContainerTitleContainer>
                    <SurahPageMainContainerSettingsContainer>
                      <SurahPageMainContainerSettingsContainerButton>
                        Translations
                        <StyledArrowDownIcon />
                      </SurahPageMainContainerSettingsContainerButton>
                    </SurahPageMainContainerSettingsContainer>
                  </SurahPageMainContainerHeader>
                  <SurahPageMainContainerBody>
                    <SurahPageMainContainerAyahsContainer>
                      {
                        surah.ayahs?.map( ( ayah ) => (
                          <SurahPageMainContainerAyahContainer key={ ayah.number }>
                            <SurahPageMainContainerAyahArabicText className={ `p${ ayah.page }` }>{ ayah.text.mushaf }</SurahPageMainContainerAyahArabicText>
                            <SurahPageMainContainerAyahTranslatedText>{ ayah.translations?.[ 0 ]?.text }</SurahPageMainContainerAyahTranslatedText>
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
