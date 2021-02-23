import FontFaceObserver from "fontfaceobserver"
import React, { createContext, useContext, useState } from "react"
import { useEffectOnce, useMedia } from "react-use"

import { isGreaterThanMediumScreen, MOBILE_SCREEN_MEDIA_QUERY } from "../../../helpers/responsive"
import { getObjectFromLocalStorage } from "../../../helpers/utility"
import { Surah } from "../../../types/surah"
import { getSurahs } from "../services/surah"

export type SelectedAyahModel = string[]
export interface SelectedAyahs {
  [ id: string ]: SelectedAyahModel
}

interface QuranContextType {
  isMobileDevice: boolean
  isRightDrawerOpen: boolean
  isSurahNamesFontLoaded: boolean
  selectedAyahs: SelectedAyahs
  surahs: { [ id: string ]: Surah }

  setIsRightDrawerOpen( isRightDrawerOpen: boolean ): void
  setIsSurahNamesFontLoaded( isSurahNamesFontLoaded: boolean ): void
  setSelectedAyahs( selectedAyahs: SelectedAyahs ): void
}

export const QuranContext = createContext<QuranContextType | null>( null )


export const QuranContextProvider: React.FunctionComponent<React.PropsWithChildren<Record<string, JSX.Element>>> = ( props ) => {
  const isMobileDevice = useMedia( MOBILE_SCREEN_MEDIA_QUERY, ! isGreaterThanMediumScreen() )
  const [ isRightDrawerOpen, setIsRightDrawerOpen ] = useState<boolean>( false )
  const [ isSurahNamesFontLoaded, setIsSurahNamesFontLoaded ] = useState<boolean>( false )
  const [ selectedAyahs, setSelectedAyahs ] = useState<{ [ id: string ]: SelectedAyahModel }>( getObjectFromLocalStorage( "selectedAyahs" ) || {} )
  const surahs = getSurahs().reduce( ( result: { [ id: string ]: Surah }, surah ) => {
    result[ surah.id ] = surah
    return result
  }, {} )

  useEffectOnce( () => {
    const surahNamesFontObserver = new FontFaceObserver( "QuranKarim" )

    surahNamesFontObserver.load( null, 15000 ).then( () => {
      setIsSurahNamesFontLoaded( true )
    } )
  } )

  const contextValue: QuranContextType = {
    isMobileDevice,
    isRightDrawerOpen,
    isSurahNamesFontLoaded,
    selectedAyahs,
    surahs,

    setIsRightDrawerOpen,
    setIsSurahNamesFontLoaded,
    setSelectedAyahs,
  }

  // eslint-disable-next-line react/prop-types
  return <QuranContext.Provider value={ { ...contextValue } }>{ props.children }</QuranContext.Provider>
}

export function useQuranState(): QuranContextType {
  const context = useContext( QuranContext )
  if( ! context ) {
    throw new Error( "useQuranState must be used within the QuranContextProvider" )
  }
  return context
}
