import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

import { setItemInStorage } from "../../../helpers/utility"
import type { RootState } from "../../../store"
import type { Ayah, SelectedAyah } from "../../../types/ayah"

interface QuranState {
  isRightDrawerOpen: boolean
  isTitleFontLoaded: boolean
  selectedAyahs: {
    [ id: string ]: SelectedAyah[]
  }
}

const initialState: QuranState = {
  isRightDrawerOpen: false,
  isTitleFontLoaded: false,
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
      const index = updatedState[ surahId ] != null ? updatedState[ surahId ].findIndex( ( surahAyah ) => surahAyah.id === ayahId ) : -1

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
    setIsRightDrawerOpen( state: QuranState ) {
      state.isRightDrawerOpen = ! state.isRightDrawerOpen
    },
    setIsTitleFontLoaded( state: QuranState, action: PayloadAction<boolean> ) {
      state.isTitleFontLoaded = action.payload
    },
    setSelectedAyahs( state: QuranState, action: PayloadAction<{ [ key: string ]: Ayah[] }> ) {
      state.selectedAyahs = {
        ...action.payload
      }
    },
    toggleAyah( state: QuranState, action: PayloadAction<{ ayah: Ayah, surahId: string }> ) {
      const { ayah, surahId } = action.payload
      const updatedState = {
        ...state.selectedAyahs,
      }
      const index = updatedState[ surahId ]?.findIndex( ( surahAyah ) => surahAyah.id === ayah.id )

      if( updatedState[ surahId ]?.length && index !== -1 ) {
        updatedState[ surahId ].splice( index, 1 )
        if( updatedState[ surahId ].length === 0 ) {
          delete updatedState[ surahId ]
        }
      } else {
        if( ! updatedState[ surahId ] ) {
          updatedState[ surahId ] = []
        }
        updatedState[ surahId ].push( {
          id: ayah.id,
          number: ayah.number,
          numberInSurah: ayah.numberInSurah,
          text: ayah.text,
        } )
        updatedState[ surahId ].sort()
      }

      setItemInStorage( "selectedAyahs", updatedState )
      state.selectedAyahs = updatedState
    },
  },
} )

export const { removeAyah, removeAyahsForSurah, setIsRightDrawerOpen, setIsTitleFontLoaded, setSelectedAyahs, toggleAyah } = quranSlice.actions
export const selectQuran = ( state: RootState ): QuranState => state.quran as QuranState
export default quranSlice.reducer
