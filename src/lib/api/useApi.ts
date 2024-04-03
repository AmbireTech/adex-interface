import useAccount from 'hooks/useAccount'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
  const { adexAccount, updateAccessToken } = useAccount()
  const navigate = useNavigate()

  useEffect(() => {
    const { endpoint, method = 'GET', headers = {}, queryParams, body } = options
    const url = BASE_URL + endpoint

    const queryString = queryParams ? new URLSearchParams(queryParams).toString() : ''
    const fullUrl = queryString ? `${url}?${queryString}` : url

    fetch(fullUrl, {
      method,
      headers: {
        'X-DSP-Auth': `Bearer ${adexAccount.accessToken}`,
        ...headers
      },
      body: JSON.stringify(body)
    })
      .then((resp) => {
        setError(!resp.ok)
        if (resp.status === 401) {
          updateAccessToken()
            .then()
            .catch(() => navigate('/login', { replace: true }))
        }

        resp.json().then(setData)
      })
      .catch(() => setError(true))
      .finally(() => setFulfilled(true))
  }, []) // eslint-disable-line

  return [data, fulfilled, error]
}

export default useApi
