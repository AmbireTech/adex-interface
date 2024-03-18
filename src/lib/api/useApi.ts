import { useEffect, useState } from 'react'

// TODO: add link to actual deploy. Check if in dev env to use localhost
const BASE_URL = 'http://localhost:3069'

type UseApi<T> = [T | null, boolean, boolean]

interface RequestOptions {
  endpoint: string
  method?: string
  headers?: Record<string, string>
  queryParams?: Record<string, string>
  body?: {}
}

function useApi<T>(options: RequestOptions): UseApi<T> {
  const [data, setData] = useState<T | null>(null)
  const [fulfilled, setFulfilled] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const { endpoint, method = 'GET', headers = {}, queryParams, body } = options
    const url = BASE_URL + endpoint

    const queryString = queryParams ? new URLSearchParams(queryParams).toString() : ''
    const fullUrl = queryString ? `${url}?${queryString}` : url

    fetch(fullUrl, {
      method,
      headers: {
        ...headers
      },
      body: JSON.stringify(body)
    })
      .then((resp) => resp.json().then(setData))
      .catch(() => setError(true))
      .finally(() => setFulfilled(true))
  }, [options])

  return [data, fulfilled, error]
}

export default useApi
