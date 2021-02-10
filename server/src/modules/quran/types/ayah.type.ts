export interface Ayah {
  hizb: number
  id: string
  juz: number
  number: number
  number_in_surah: number
  manzil: number
  page: number
  surah_id: string
  text: {
    indopak: string
    mushaf: string
    simple: string
    uthmani: string
  }
  translations?: { [ identifier: string ]: string }
}
