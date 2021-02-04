import { HttpMethod, sendHttpRequest } from "../../../helpers/api"
import { Ayah } from "../../../types/ayah"
import { Pagination } from "../../../types/pagination"
import { SURAHS } from "../constants/surah"

export function getSurahs() {
  return [ ...SURAHS ]
}

export function getSurahAyahs( id: string, options: { page: number, per_page: number, embeds?: string[] } ) {
  let url = `/surahs/${ id }/ayahs?page=${ options.page }&per_page=${ options.per_page }`

  if( options.embeds ) {
    url += `&embed=${ options.embeds.join( "," ) }`
  }

  return sendHttpRequest<{ items: Ayah[], pagination: Pagination }>( {
    method: HttpMethod.GET,
    url,
  } )
}
