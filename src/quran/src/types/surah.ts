import type { Ayah } from "./ayah"

export interface Surah {
  id: string
  ayahs?: Ayah[]
  hasBismillah: boolean
  name: string
  number: number
  numberOfAyahs: number
  queryIndexes: string[]
  revelation: {
    order: number
    place: string
  }
  translations: Array<{
    language: string
    text: string
  }>
  transliterations: Array<{
    language: string
    text: string
  }>
  unicode: string
}
