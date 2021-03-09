import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

import { setItemInStorage } from "../../../helpers/utility"
import type { RootState } from "../../../store"

interface QuranState {
  isSurahTitleFontLoaded: boolean
  selectedAyahs: {
    [ id: string ]: string[]
  }
}

const initialState: QuranState = {
  isSurahTitleFontLoaded: false,
  selectedAyahs: {}
}

export const quranSlice = createSlice( {
  name: "quran",
  initialState,
  reducers: {
    removeAyah( state: QuranState, action: PayloadAction<{ ayahId: string, surahId: string }> ) {
      const { ayahId, surahId } = action.payload
      const updatedState = {
        ...state.selectedAyahs,
      }
      const index = updatedState[ surahId ] != null ? updatedState[ surahId ].findIndex( ( number ) => number === ayahId ) : -1

      if( index === -1 ) {
        return
      }

      updatedState[ surahId ].splice( index, 1 )
      if( updatedState[ surahId ].length === 0 ) {
        delete updatedState[ surahId ]
      }
      setItemInStorage( "selectedAyahs", updatedState )
      state.selectedAyahs = updatedState
    },
    removeAyahsForSurah( state: QuranState, action: PayloadAction<string> ) {
      const updatedState = {
        ...state.selectedAyahs,
      }
      delete updatedState[ action.payload ]
      setItemInStorage( "selectedAyahs", updatedState )
      state.selectedAyahs = updatedState
    },
    setSelectedAyahs( state: QuranState, action: PayloadAction<{ [ key: string ]: string[] }> ) {
      state.selectedAyahs = {
        ...action.payload
      }
    },
    toggleAyah( state: QuranState, action: PayloadAction<{ ayahId: string, surahId: string }> ) {
      const { ayahId, surahId } = action.payload
      const updatedState = {
        ...state.selectedAyahs,
      }
      const index = updatedState[ surahId ]?.findIndex( ( ayahIds ) => ayahIds.includes( ayahId ) )

      if( updatedState[ surahId ]?.length && index !== -1 ) {
        updatedState[ surahId ].splice( index, 1 )
        if( updatedState[ surahId ].length === 0 ) {
          delete updatedState[ surahId ]
        }
      } else {
        if( ! updatedState[ surahId ] ) {
          updatedState[ surahId ] = []
        }
        updatedState[ surahId ].push( ayahId )
        updatedState[ surahId ].sort()
      }

      setItemInStorage( "selectedAyahs", updatedState )
      state.selectedAyahs = updatedState
    },
  },
} )

export const { removeAyah, removeAyahsForSurah, setSelectedAyahs, toggleAyah } = quranSlice.actions
export const selectHome = ( state: RootState ): QuranState => state.quran as QuranState
export default quranSlice.reducer