import { Ayah } from "./ayah.type"

export interface Juz {
  ayahs?: Ayah[]
  id: string
  number: string
  verses: Array<{
    end: number
    start: number
    surah_id: string
  }>
}