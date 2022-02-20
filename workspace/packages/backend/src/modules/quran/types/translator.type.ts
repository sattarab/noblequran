export interface Translator {
  id: string
  name: string
  language: string
  translations: Array<{
    language: string
    name: string
  }>
}
