import { Ayah } from "./ayah.type"

export interface Surah {
  id: string
  ayahs?: Ayah[]
  hasBismillah: boolean
  name: string
  number: number
  numberOfAyahs: number
  queryIndexes: string[]
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
}
