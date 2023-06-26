import { useCallback, useState } from 'react'
import { IInvoices, IStatements } from 'types'

function usePagination({
  elements,
  maxItemsPerPage
}: {
  elements: IInvoices[] | IStatements[]
  maxItemsPerPage: number
}) {
  const defaultPage = 1
  const [page, setPage] = useState(defaultPage)
  const maxPages = Math.ceil(elements.length / maxItemsPerPage)
  const startIndex = (page - 1) * maxItemsPerPage
  const endIndex = page * maxItemsPerPage
  const list = elements.slice(startIndex, endIndex)
  const onNextPage = useCallback(() => {
    setPage((prevState) => (prevState + 1 <= maxPages ? prevState + 1 : prevState))
  }, [maxPages])
  const onPreviousPage = useCallback(() => {
    setPage((prevState) => (prevState - 1 >= defaultPage ? prevState - 1 : prevState))
  }, [])
  const onChange = useCallback((value: number) => {
    setPage(value)
  }, [])

  return { maxPages, defaultPage, list, onNextPage, onPreviousPage, onChange }
}
export default usePagination
