import React, { createContext, useContext } from "react"
import { useMedia } from "react-use"

import { isGreaterThanMediumScreen, MOBILE_SCREEN_MEDIA_QUERY } from "../../../helpers/responsive"
import { Surah } from "../../../types/surah"
import { getSurahs } from "../services/surah"

interface QuranContextType {
  isMobileDevice: boolean
  surahs: { [ id: string ]: Surah },
}

export const QuranContext = createContext<QuranContextType | null>( null )


export const QuranContextProvider: React.FunctionComponent<React.PropsWithChildren<Record<string, JSX.Element[]>>> = ( props ) => {
  const isMobileDevice = useMedia( MOBILE_SCREEN_MEDIA_QUERY, ! isGreaterThanMediumScreen() )
  const surahs = getSurahs().reduce( ( result: { [ id: string ]: Surah }, surah ) => {
    result[ surah.id ] = surah
    return result
  }, {} )

  const contextValue: QuranContextType = {
    isMobileDevice,
    surahs,
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
