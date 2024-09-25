export interface IUsePagination {
  maxPages: number
  defaultPage: number
  startIndex: number
  endIndex: number
  page: number
  onNextPage: () => void
  onPreviousPage: () => void
  onChange: (value: number) => void
}

export interface IUsePaginationProps {
  elementsLength: number
  maxItemsPerPage: number
}
