interface RequestOptions<T> {
  url: string
  method?: string
  headers?: Record<string, string>
  queryParams?: Record<string, string>
  body?: T | FormData
}

export async function fetchService<T>(options: RequestOptions<T>) {
  const { url, method = 'GET', headers = {}, queryParams, body } = options

  const queryString = queryParams ? new URLSearchParams(queryParams).toString() : ''
  const fullUrl = queryString ? `${url}?${queryString}` : url

  return fetch(fullUrl, {
    method,
    headers: {
      ...headers
    },
    body: body instanceof FormData ? body : JSON.stringify(body)
  })
}
