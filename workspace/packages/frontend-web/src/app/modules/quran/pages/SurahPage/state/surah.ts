import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

import { setItemInStorage } from "../../../../../helpers/utility"
import type { RootState } from "../../../../../store"
import { getDefaultTranslation } from "../../../services/surah"

interface SurahPageState {
  selectedTranslations: string[]
}

const initialState: SurahPageState = {
  selectedTranslations: [ getDefaultTranslation() ],
}

export const surahSlice = createSlice( {
  name: "surah",
  initialState,
  reducers: {
    setSelectedTranslations( state: SurahPageState, action: PayloadAction<string[]> ) {
      state.selectedTranslations = [
        ...action.payload,
      ]
      setItemInStorage( "translations", action.payload )
    },
  },
} )

export const { setSelectedTranslations } = surahSlice.actions
export const selectHome = ( state: RootState ): SurahPageState => state.surah as SurahPageState
export default surahSlice.reducer
