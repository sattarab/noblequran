export interface Translation {
  id: string
  translations: Array<{
    text: string
    translator_id: string
  }>
}
