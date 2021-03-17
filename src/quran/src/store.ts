import { configureStore } from "@reduxjs/toolkit"

import home from "./modules/quran/pages/HomePage/state/home"
import surah from "./modules/quran/pages/SurahPage/state/surah"
import quran from "./modules/quran/state/quran"

const store = configureStore( {
  reducer: {
    home,
    quran,
    surah,
  },
} )

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store
