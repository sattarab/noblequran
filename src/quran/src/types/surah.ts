import { Ayah } from "./ayah"

export interface Surah {
  id: string
  ayahs?: Ayah[]
  has_bismillah: boolean
  name: string
  number: number
  number_of_ayahs: number
  query_indexes: string[]
  revelation: {
    place: string
    order: number
  }
  translations: Array<{
    language: string
    text: string
  }>
  transliterations: Array<{
    language: string
    text: string
  }>
  unicode?: string
}