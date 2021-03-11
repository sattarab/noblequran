import type { Ayah } from "./ayah.type"

export interface Juz {
  ayahs?: Ayah[]
  id: string
  number: string
  verses: Array<{
    end: number
    start: number
    surahId: string
  }>
}
