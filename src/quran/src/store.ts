import { combineReducers, configureStore } from "@reduxjs/toolkit"

import homeReducer from "./modules/quran/pages/HomePage/state/homeSlice"
import quranReducer from "./modules/quran/state/quranSlice"

const store = configureStore( {
  reducer: combineReducers( {
    homeReducer,
    quranReducer,
  } )
} )


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
