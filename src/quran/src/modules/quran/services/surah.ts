import { HttpMethod, sendHttpRequest } from "../../../helpers/api"

import { Ayah } from "../../../types/ayah"
import { Pagination } from "../../../types/pagination"
import { SURAHS } from "../constants/surah"

export function getSurahs() {
  return [ ...SURAHS ]
}

export function getSurahAyahs( id: string ) {
  return sendHttpRequest<{ items: Ayah[], pagination: Pagination }>( {
    method: HttpMethod.GET,
    url: `/surahs/${ id }/ayahs?translations=en.sahih`,
  } )
}