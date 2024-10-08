export type RequestOptions = {
  url: string
  method?: 'GET' | 'POST' | 'OPTIONS' | 'PUT' | 'DELETE'
  headers?: Record<string, string>
  queryParams?: Record<string, string>
  body?: BodyInit
}

export async function fetchService(options: RequestOptions): Promise<Response> {
  const { url, method = 'GET', headers = {}, queryParams, body } = options

  const queryString = queryParams ? new URLSearchParams(queryParams).toString() : ''
  // TODO: this will not work if there are query params in the url
  const fullUrl = queryString ? `${url}?${queryString}` : url

  return fetch(fullUrl, {
    method,
    headers: {
      ...headers
    },
    body
  })
}

export const getReqErr = (res: any, text: any) => {
  let message = res.statusText
  try {
    const textObj = JSON.parse(text)
    message =
      textObj?.message ||
      textObj?.msg ||
      textObj?.errMsg ||
      textObj?.error ||
      res.statusText ||
      text
  } catch (err) {
    console.error(err)
  }

  // throw new Error(`${res.url}, ${res.status}, ${res.statusText}, ${message}`)
  console.error(`${res.url}, ${res.status}, ${res.statusText}, ${message}`)
  return message
}
