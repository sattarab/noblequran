import type { Theme } from "@material-ui/core/styles"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import FontFaceObserver from "fontfaceobserver"
import React, { createContext, useContext, useState } from "react"
import { useEffectOnce, useMedia } from "react-use"

import { BLUE_COLOR, BORDER_COLOR, DEFAULT_TEXT_COLOR, RIGHT_DRAWER_WIDTH } from "../../../components/Styles"
import { isGreaterThanMediumScreen, MOBILE_SCREEN_MEDIA_QUERY } from "../../../helpers/responsive"
import { getObjectFromLocalStorage } from "../../../helpers/utility"
import type { Surah } from "../../../types/surah"
import { getSurahs } from "../services/surah"
export interface DisplaySurahVersesMap {
  [ surahId: string ]: boolean
}

export type SelectedAyahModel = string[]
export interface SelectedAyahs {
  [ id: string ]: SelectedAyahModel
}

interface QuranContextType {
  baseClasses: Record<"header" | "headerShift" | "iconButton" | "svgIcon" | "svgIconActive" | "svgIconDisabled", string>
  displaySurahVersesMap: DisplaySurahVersesMap
  isMobileDevice: boolean
  isRightDrawerOpen: boolean
  isSurahNamesFontLoaded: boolean
  myBookmarks: string[]
  selectedAyahs: SelectedAyahs
  surahs: { [ id: string ]: Surah }

  setBaseClasses( classes: Record<string, string> ): void
  setDisplaySurahVersesMap( displaySurahVersesMap: DisplaySurahVersesMap ): void
  setIsRightDrawerOpen( isRightDrawerOpen: boolean ): void
  setIsSurahNamesFontLoaded( isSurahNamesFontLoaded: boolean ): void
  setMyBookmarks( myBookmarks: string[] ): void
  setSelectedAyahs( selectedAyahs: SelectedAyahs ): void
}

export const QuranContext = createContext<QuranContextType | null>( null )


const useStyles = makeStyles( ( theme: Theme ) =>
  createStyles( {
    header: {
      transition: theme.transitions.create( [ "margin", "width" ], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      } ),
      marginRight: 0,
      width: "100%",
    },
    headerShift: {
      transition: theme.transitions.create( [ "margin", "width" ], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      } ),
      marginRight: RIGHT_DRAWER_WIDTH,
      width: `calc( 100% - ${ RIGHT_DRAWER_WIDTH } )`,
    },
    iconButton: {
      cursor: "pointer",
      margin: "0 5px",
    },
    svgIcon: {
      fill: DEFAULT_TEXT_COLOR,
    },
    svgIconActive: {
      fill: BLUE_COLOR,
    },
    svgIconDisabled: {
      fill: BORDER_COLOR,
    },
  } ),
)

export const QuranContextProvider: React.FunctionComponent<React.PropsWithChildren<Record<string, JSX.Element>>> = ( props ) => {
  const isMobileDevice = useMedia( MOBILE_SCREEN_MEDIA_QUERY, ! isGreaterThanMediumScreen() )
  const [ baseClasses, setBaseClasses ] = useState<Record<string, string>>( useStyles() )
  const [ displaySurahVersesMap, setDisplaySurahVersesMap ] = useState<DisplaySurahVersesMap>( {} )
  const [ isRightDrawerOpen, setIsRightDrawerOpen ] = useState<boolean>( false )
  const [ isSurahNamesFontLoaded, setIsSurahNamesFontLoaded ] = useState<boolean>( false )
  const [ myBookmarks, setMyBookmarks ] = useState<string[]>( getObjectFromLocalStorage( "surahBookmarks" ) || [] )
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
    baseClasses,
    displaySurahVersesMap,
    isMobileDevice,
    isRightDrawerOpen,
    isSurahNamesFontLoaded,
    myBookmarks,
    selectedAyahs,
    surahs,

    setBaseClasses,
    setDisplaySurahVersesMap,
    setIsRightDrawerOpen,
    setIsSurahNamesFontLoaded,
    setMyBookmarks,
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
