export interface Pagination {
  count: number
  last_page?: number
  next_page?: number | null
  page: number
  page_start?: number
  pageEnd?: number
  perPage: number
  prev_page?: number | null
}
