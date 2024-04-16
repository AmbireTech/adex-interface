import useAccount from 'hooks/useAccount'
import { useCallback } from 'react'
import { fetchService, getReqErr, RequestOptions } from 'services'
import useCustomNotifications from 'hooks/useCustomNotifications'

export const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_BASE_URL
export const VALIDATOR_BASE_URL = process.env.REACT_APP_VALIDATOR_BASE_URL

const processResponse = (res: any) => {
  // console.log('res', res)
  if (res.status >= 200 && res.status < 400) {
    return res.json()
  }
  // TODO: fix that
  return res.text().then((text: any) => {
    if (res.status === 401 || res.status === 403) {
      console.error('unauthorized', text)
    }

    const err = getReqErr(res, text)
    throw new Error(err)
  })
}

type AdExService = 'backend' | 'validator'

type ApiRequestOptions<T> = Omit<RequestOptions<T>, 'url'> & {
  route: string
  noAuth?: boolean
}

export const useAdExApi = () => {
  // TODO: get adexAccount here
  const { updateAccessToken, adexAccount } = useAccount()
  const { showNotification } = useCustomNotifications()

  const adexServicesRequest = useCallback(
    async <T>(service: AdExService, reqOptions: ApiRequestOptions<T>): Promise<T> => {
      // temp hax for using the same token fot validator auth
      const authHeaderProp = service === 'backend' ? 'X-DSP-AUTH' : 'authorization'

      // url check
      // TODO: route instead url in props
      const baseUrl = (service === 'backend' ? BACKEND_BASE_URL : VALIDATOR_BASE_URL) || ''
      const urlCheck = reqOptions.route.replace(baseUrl, '').replace(/^\//, '')

      const req: RequestOptions<T> = {
        url: `${baseUrl}/${urlCheck}`,
        method: reqOptions.method,
        body: reqOptions.body,
        queryParams: reqOptions.queryParams,
        headers: reqOptions.headers
      }

      // console.log('adexAccount', adexAccount)
      if (!adexAccount.accessToken) throw new Error('Access token is missing')

      const authHeader = {
        [authHeaderProp]: `Bearer ${adexAccount.accessToken}`
      }

      // TODO: log-out if no access token
      // TODO: fix updateAccessToken logic - it returns if there are no access token,
      // it should throw ot log-out
      // TODO: if using updateAccessToken triggers some circular updates - account context should be fixed
      const response = await updateAccessToken()

      if (response) {
        const updatedAccessToken = response.accessToken
        authHeader[authHeaderProp] = `Bearer ${updatedAccessToken}`
      }

      req.headers = {
        ...authHeader,
        ...req.headers
      }

      console.log('req', req)

      return fetchService(req)
        .then(processResponse)
        .catch((err) => showNotification('error', err.message, 'Data error'))
    },
    [adexAccount.accessToken, updateAccessToken, showNotification]
  )

  return {
    adexServicesRequest
  }
}
