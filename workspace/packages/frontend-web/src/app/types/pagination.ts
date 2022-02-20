export interface Pagination {
  count: number
  lastPage?: number
  nextPage?: number | null
  page: number
  pageStart?: number
  pageEnd?: number
  perPage: number
  prevPage?: number | null
}
