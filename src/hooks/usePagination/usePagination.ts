import { useCallback, useMemo, useState } from 'react'
import { IUsePagination, IUsePaginationProps } from 'types'

function usePagination({ elementsLength, maxItemsPerPage }: IUsePaginationProps): IUsePagination {
  const defaultPage = 1
  const [page, setPage] = useState<number>(defaultPage)
  const maxPages = useMemo(
    () => Math.ceil(elementsLength / maxItemsPerPage),
    [elementsLength, maxItemsPerPage]
  )

  const startIndex = useMemo(() => (page - 1) * maxItemsPerPage, [page, maxItemsPerPage])
  const endIndex = useMemo(() => page * maxItemsPerPage, [page, maxItemsPerPage])

  const onNextPage = () => setPage((prevState) => prevState + 1)
  const onPreviousPage = () => setPage((prevState) => prevState - 1)
  const onChange = useCallback((value: number) => {
    setPage(value)
  }, [])

  return {
    maxPages,
    defaultPage,
    startIndex,
    endIndex,
    onNextPage,
    onPreviousPage,
    onChange,
    page
  }
}
export default usePagination
