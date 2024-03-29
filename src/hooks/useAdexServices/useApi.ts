import useAccount from 'hooks/useAccount'
import { useCallback } from 'react'
import { fetchService, RequestOptions } from 'services'

export const BACKEND_BASE_URL = process.env.REACT_BACKEND_BASE_URL
export const VALIDATOR_BASE_URL = process.env.REACT_VALIDATOR_BASE_URL

// TODO: move it to helper
const processResponse = (res: any) => {
  if (res.status >= 200 && res.status < 400) {
    return res.json()
  }
  // TODO: fix that
  return res.text().then((text: any) => {
    if (res.status === 401 || res.status === 403) {
      console.error('something went wrong', text)
    }
  })
}

type AdExService = 'backend' | 'validator'

type ApiRequestOptions<T> = Omit<RequestOptions<T>, 'url'> & { route: string }

export const useAdExApi = () => {
  // TODO: get adexAccount here
  const { updateAccessToken, adexAccount } = useAccount()

  const adexServicesRequest = useCallback(
    async <T>(service: AdExService, reqOptions: ApiRequestOptions<T>) => {
      // temp hax for using the same token fot validator auth
      const authHeaderProp = service === 'backend' ? 'X-DSP-AUTH' : 'Authentication'

      // url check
      // TODO: route instead url in props
      const baseUrl = (service === 'backend' ? BACKEND_BASE_URL : VALIDATOR_BASE_URL) || ''
      const urlCheck = reqOptions.route.replace(baseUrl, '').replace(/^\//, '')

      const req: RequestOptions<T> = {
        url: `${baseUrl}/${urlCheck}`,
        method: reqOptions.method,
        body: reqOptions.body,
        queryParams: reqOptions.queryParams
      }

      const authHeader = {
        [authHeaderProp]: `Bearer ${adexAccount?.accessToken}`
      }

      // TODO: log-out if no access token
      // TODO: fix updateAccessToken logic - it returns if there are no access token,
      // it should throw ot log-out
      // TODO: if using updateAccessToken triggers some circular updates - account context should be fixed
      const response = await updateAccessToken()

      if (response) {
        const updatedAccessToken = response.accessToken
        authHeader[authHeaderProp] = updatedAccessToken
      }

      req.headers = {
        ...authHeader,
        ...req.headers
      }

      return fetchService(req).then(processResponse)
    },
    [updateAccessToken, adexAccount]
  )

  return {
    adexServicesRequest
  }
}
