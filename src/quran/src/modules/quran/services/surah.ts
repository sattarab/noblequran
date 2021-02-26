import { HttpMethod, sendHttpRequest } from "../../../helpers/api"
import type { Ayah } from "../../../types/ayah"
import type { Pagination } from "../../../types/pagination"
import type { Surah } from "../../../types/surah"
import type { Translator } from "../../../types/translator"
import { SURAHS } from "../constants/surah"

export function getSurahs(): Surah[] {
  return [ ...SURAHS ]
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
