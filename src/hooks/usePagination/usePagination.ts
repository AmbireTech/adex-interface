import useBasePath from 'hooks/useBasePath'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { IInvoices, IStatements } from 'types'

function usePagination({
  elements,
  maxItemsPerPage
}: {
  elements: IInvoices[] | IStatements[]
  maxItemsPerPage: number
}) {
  const params = useParams()
  const navigate = useNavigate()
  const basePath = useBasePath()

  const maxPages = useMemo(
    () => Math.ceil(elements.length / maxItemsPerPage),
    [elements.length, maxItemsPerPage]
  )
  const defaultPage = useMemo(
    () => Math.min(Math.max(Number(params.page), 1), maxPages) || 1,
    [params.page, maxPages]
  )
  const [page, setPage] = useState(defaultPage)
  const list = useMemo(
    () => elements.slice((page - 1) * maxItemsPerPage, page * maxItemsPerPage),
    [elements, page, maxItemsPerPage]
  )
  const onNextPage = useCallback(
    () => page < maxPages && setPage((prevState) => prevState + 1),
    [page, maxPages]
  )
  const onPreviousPage = useCallback(
    () => page > 1 && setPage((prevState) => prevState - 1),
    [page]
  )
  const onChange = useCallback((value: number) => {
    setPage(value)
  }, [])

  useEffect(() => navigate(`${basePath}/${page}`, { replace: true }), [basePath, page, navigate])

  return { maxPages, defaultPage, list, onNextPage, onPreviousPage, onChange }
}
export default usePagination
