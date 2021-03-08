import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice } from "@reduxjs/toolkit"

import { escapeRegex, setItemInStorage } from "../../../../../helpers/utility"
import type { RootState } from "../../../../../store"
import type { Surah } from "../../../../../types/surah"
import { getSurahs } from "../../../services/surah"

interface HomePageState {
  bookmarks: string[]
  displayBookmarks: boolean
  isHeaderFixed: boolean
  searchText: string
  surahs: Surah[]
}

const defaultSurahs = getSurahs()

const initialState: HomePageState = {
  bookmarks: [],
  displayBookmarks: false,
  isHeaderFixed: false,
  searchText: "",
  surahs: defaultSurahs,
}

const filter = ( state: HomePageState ) => {
  if( ! state.searchText && ! state.displayBookmarks ) {
    if( state.surahs.length !== defaultSurahs.length ) {
      state.surahs = defaultSurahs
    }

    return
  }

  const regex = state.searchText ? new RegExp( escapeRegex( state.searchText ), "i" ) : null
  const filteredSurahs: Surah[] = []

  for( const surah of defaultSurahs ) {
    if( regex ) {
      for( const queryIndex of surah.queryIndexes ) {
        if( regex.test( queryIndex )
            && ( ! state.displayBookmarks || state.bookmarks.includes( surah.id ) )
        ) {
          filteredSurahs.push( surah )
          break
        }
      }
    } else if( state.displayBookmarks && state.bookmarks.includes( surah.id ) ) {
      filteredSurahs.push( surah )
    }
  }

  state.surahs = filteredSurahs
}

export const homeSlice = createSlice( {
  name: "homeReducer",
  initialState,
  reducers: {
    bookmarks( state: HomePageState, action: PayloadAction<string[]> ) {
      state.bookmarks = action.payload
    },
    reset( state: HomePageState ) {
      state.searchText = ""
      state.displayBookmarks = false
      state.surahs = defaultSurahs
    },
    search( state: HomePageState, action: PayloadAction<string> ) {
      state.searchText = action.payload
      filter( state )
    },
    setIsHeaderFixed( state: HomePageState, action: PayloadAction<boolean> ) {
      if( state.isHeaderFixed !== action.payload ) {
        state.isHeaderFixed = action.payload
      }
    },
    toggleBookmark( state: HomePageState, action: PayloadAction<string> ) {
      const updatedBookmarks = [
        ...state.bookmarks,
      ]
      const index = updatedBookmarks.findIndex( ( surahId ) => surahId === action.payload )

      if( index !== -1 ) {
        updatedBookmarks.splice( index, 1 )
      } else {
        updatedBookmarks.push( action.payload )
      }

      setItemInStorage( "surahBookmarks", updatedBookmarks )
      state.bookmarks = updatedBookmarks
      filter( state )
    },
    toggleDisplayBookmarks( state: HomePageState ) {
      state.displayBookmarks = ! state.displayBookmarks
      filter( state )
    },
  },
} )

export const { bookmarks, reset, search, setIsHeaderFixed, toggleBookmark, toggleDisplayBookmarks } = homeSlice.actions
export const selectHome = ( state: RootState ): HomePageState => state.homeReducer as HomePageState
export default homeSlice.reducer
