export const enum WordType {
  END = "end",
  PAUSE = "pause",
  WORD = "word",
}

export const enum FormatType {
  INDOPAK = "indopak",
  MUSHAF = "mushaf",
  UTHMANI = "uthmani",
}

export interface Ayah {
  hizb: number
  id: string
  juz: number
  number: number
  numberInSurah: number
  manzil: number
  page: number
  surahId: string
  text: {
    indopak: string
    mushaf: string
    simple: string
    uthmani: string
  }
  translations?: { [ identifier: string ]: string }
  words: Array<{
    id: string
    type: WordType
    text: {
      indopak: string
      mushaf: string
      uthmani: string
    }
    translations: Array<{
      language: string
      text: string
    }>
  }>
}
