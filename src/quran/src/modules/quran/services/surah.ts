import type { History } from "history"
import PropTypes from "prop-types"

import { HttpMethod, sendHttpRequest } from "../../../helpers/api"
import type { Ayah } from "../../../types/ayah"
import type { Pagination } from "../../../types/pagination"
import type { Surah } from "../../../types/surah"
import type { Translator } from "../../../types/translator"
import { SURAHS } from "../constants/surah"

export const SurahPropType = PropTypes.shape( {
  id: PropTypes.string.isRequired,
  hasBismillah: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  number: PropTypes.number.isRequired,
  numberOfAyahs: PropTypes.number.isRequired,
  queryIndexes: PropTypes.arrayOf( PropTypes.string.isRequired ).isRequired,
  revelation: PropTypes.exact( {
    order: PropTypes.number.isRequired,
    place: PropTypes.string.isRequired
  } ).isRequired,
  translations: PropTypes.arrayOf( PropTypes.shape( {
    language: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  } ).isRequired ).isRequired,
  transliterations: PropTypes.arrayOf( PropTypes.shape( {
    language: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  } ).isRequired ).isRequired,
  unicode: PropTypes.string.isRequired,
} ).isRequired

export function getSurahs(): Surah[] {
  return [ ...SURAHS ]
}


export function getSurahsById(): { [ id: string ]: Surah } {
  return getSurahs().reduce( ( result: { [ id: string ]: Surah }, surah ) => {
    result[ surah.id ] = surah
    return result
  }, {} )
}

export function getSurahAyahs( id: string, options: { page: number, perPage: number, translations?: string[] } ): Promise<{ items: Ayah[], pagination: Pagination }> {
  let url = `/surahs/${ id }/ayahs?page=${ options.page }&perPage=${ options.perPage }`

  if( options.translations ) {
    url += `&translations=${ options.translations.join( "," ) }`
  }

  return sendHttpRequest<{ items: Ayah[], pagination: Pagination }>( {
    method: HttpMethod.GET,
    url,
  } )
}

export function getTranslatorsGroupedByLanguage(): Promise<Translator[]> {
  return sendHttpRequest<Translator[]>( {
    method: HttpMethod.GET,
    url: "/translators",
  } )
}

export function readSurah( history: History, surahId: string ): void {
  history.push( `/${ surahId }` )
  window.scroll( 0, 0 )
}
