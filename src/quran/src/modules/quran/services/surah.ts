import { HttpMethod, sendHttpRequest } from "../../../helpers/api"
import { Surah } from "../../../types/surah"
import { SURAHS } from "../constants/surah"

export function getSurahs() {
  return [ ...SURAHS ]
}