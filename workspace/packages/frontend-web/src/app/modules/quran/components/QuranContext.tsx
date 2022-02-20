import type { Theme } from "@material-ui/core/styles"
import { createStyles, makeStyles } from "@material-ui/core/styles"
import FontFaceObserver from "fontfaceobserver"
import React, { createContext, useContext } from "react"
import { useMedia } from "react-use"

import {
  BLUE_COLOR,
  BORDER_COLOR,
  DEFAULT_TEXT_COLOR,
  RIGHT_DRAWER_WIDTH,
} from "../../../components/Styles"
import { isGreaterThanMediumScreen, MOBILE_SCREEN_MEDIA_QUERY } from "../../../helpers/responsive"
import { useAppDispatch } from "../../../hooks"
import type { Surah } from "../../../types/surah"
import { getSurahsById, getSurahsBySlug } from "../services/surah"
import { setIsTitleFontLoaded } from "../state/quran"

export type SelectedAyahModel = string[]
export interface SelectedAyahs {
  [ id: string ]: SelectedAyahModel
}

interface QuranContextType {
  baseClasses: Record<"header" | "headerShift" | "iconButton" | "svgIcon" | "svgIconActive" | "svgIconDisabled", string>
  isMobileDevice: boolean
  surahs: { [ id: string ]: Surah }
  surahsSlugHash: { [ slug: string ]: Surah }
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
  const baseClasses = useStyles()
  const dispatch = useAppDispatch()
  const isMobileDevice = useMedia( MOBILE_SCREEN_MEDIA_QUERY, ! isGreaterThanMediumScreen() )
  const surahs = getSurahsById()
  const surahsSlugHash = getSurahsBySlug()

  const surahNamesFontObserver = new FontFaceObserver( "QuranKarim" )

  surahNamesFontObserver.load( null, 15000 ).then( () => {
    dispatch( setIsTitleFontLoaded( true ) )
  } )

  const contextValue: QuranContextType = {
    baseClasses,
    isMobileDevice,
    surahs,
    surahsSlugHash,
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
