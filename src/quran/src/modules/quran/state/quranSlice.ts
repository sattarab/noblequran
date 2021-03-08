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
  name: "quranReducer",
  initialState,
  reducers: {
    removeAyah( state: QuranState, action: PayloadAction<{ ayahId: string, surahId: string }> ) {
      const { ayahId, surahId } = action.payload
      const updatedSelectedAyahs = {
        ...state.selectedAyahs,
      }
      const index = updatedSelectedAyahs[ surahId ] != null ? updatedSelectedAyahs[ surahId ].findIndex( ( number ) => number === ayahId ) : -1

      if( index === -1 ) {
        return
      }

      updatedSelectedAyahs[ surahId ].splice( index, 1 )
      setItemInStorage( "selectedAyahs", updatedSelectedAyahs )
      state.selectedAyahs = {
        ...updatedSelectedAyahs
      }
    },
    removeAyahsForSurah( state: QuranState, action: PayloadAction<string> ) {
      const updatedSelectedAyahs = {
        ...state.selectedAyahs,
      }
      delete updatedSelectedAyahs[ action.payload ]
      setItemInStorage( "selectedAyahs", updatedSelectedAyahs )
      state.selectedAyahs = {
        ...updatedSelectedAyahs
      }
    },
    selectedAyahs( state: QuranState, action: PayloadAction<{ [ key: string ]: string[] }> ) {
      state.selectedAyahs = action.payload
    },
    toggleAyah( state: QuranState, action: PayloadAction<{ ayahId: string, surahId: string }> ) {
      const { ayahId, surahId } = action.payload
      const updatedSelectedAyahs = {
        ...state.selectedAyahs,
      }
      const index = updatedSelectedAyahs[ surahId ]?.findIndex( ( ayahIds ) => ayahIds.includes( ayahId ) )

      if( updatedSelectedAyahs[ surahId ]?.length && index !== -1 ) {
        updatedSelectedAyahs[ surahId ].splice( index, 1 )
        if( updatedSelectedAyahs[ surahId ].length === 0 ) {
          delete updatedSelectedAyahs[ surahId ]
        }
      } else {
        if( ! updatedSelectedAyahs[ surahId ] ) {
          updatedSelectedAyahs[ surahId ] = []
        }
        updatedSelectedAyahs[ surahId ].push( ayahId )
        updatedSelectedAyahs[ surahId ].sort()
      }

      setItemInStorage( "selectedAyahs", updatedSelectedAyahs )
      state.selectedAyahs = {
        ...updatedSelectedAyahs
      }
    },
  },
} )

export const { removeAyah, removeAyahsForSurah, selectedAyahs, toggleAyah } = quranSlice.actions
export const selectHome = ( state: RootState ): QuranState => state.quranReducer as QuranState
export default quranSlice.reducer
