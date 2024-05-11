export interface GetAllResponseDTO {
  totalPages: number
  totalElements: number
  size: number
  number: number
  sort: Sort
  first: boolean
  last: boolean
  numberOfElements: number
  pageable: Pageable
  empty: boolean
}

interface Pageable {
  offset: number
  sort: Sort
  pageNumber: number
  pageSize: number
  paged: boolean
  unpaged: boolean
}

interface Sort {
  empty: boolean
  sorted: boolean
  unsorted: boolean
}
export interface GetAllRequestDTO {
  page: number
  size: number
}
