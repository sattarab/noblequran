export interface Pagination {
  count: number
  last_page?: number
  next_page?: number | null
  page: number
  page_start?: number
  page_end?: number
  per_page: number
  prev_page?: number | null
}
