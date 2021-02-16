import React, { createContext, useContext, useState } from "react"
import { useMedia } from "react-use"

import { isGreaterThanMediumScreen, MOBILE_SCREEN_MEDIA_QUERY } from "../../../helpers/responsive"
import { getObjectFromLocalStorage } from "../../../helpers/utility"
import { Ayah } from "../../../types/ayah"
import { Surah } from "../../../types/surah"
import { getSurahs } from "../services/surah"

export type SelectedAyahModel = Pick<Ayah, "id" | "number_in_surah" | "text">
export interface SelectedAyahs {
  [ id: string ]: SelectedAyahModel
}

interface QuranContextType {
  isMobileDevice: boolean
  selectedAyahs: SelectedAyahs
  surahs: { [ id: string ]: Surah },

  setSelectedAyahs( selectedAyahs: SelectedAyahs ): void
}

export const QuranContext = createContext<QuranContextType | null>( null )


export const QuranContextProvider: React.FunctionComponent<React.PropsWithChildren<Record<string, JSX.Element[]>>> = ( props ) => {
  const isMobileDevice = useMedia( MOBILE_SCREEN_MEDIA_QUERY, ! isGreaterThanMediumScreen() )
  const [ selectedAyahs, setSelectedAyahs ] = useState<{ [ id: string ]: SelectedAyahModel }>( getObjectFromLocalStorage( "selectedAyahs" ) || {} )
  const surahs = getSurahs().reduce( ( result: { [ id: string ]: Surah }, surah ) => {
    result[ surah.id ] = surah
    return result
  }, {} )

  const contextValue: QuranContextType = {
    isMobileDevice,
    selectedAyahs,
    surahs,

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
