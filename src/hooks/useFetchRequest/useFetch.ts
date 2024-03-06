import useAccount from 'hooks/useAccount'
import { useCallback } from 'react'
import { fetchService } from 'services'

const processResponse = (res: any) => {
  if (res.status >= 200 && res.status < 400) {
    return res.json()
  }
  // TODO: fix that
  return res.text().then((text: any) => {
    if (res.status === 401 || res.status === 403) {
      console.error('something went wrong', text)
      // logOut(skipRedirect)
    }
  })
}

const useFetch = () => {
  const { adexAccount, setAdexAccount } = useAccount()

  // TODO: move it to helper
  const parseJwt = (token: string) => {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        // eslint-disable-next-line prefer-template
        .map((c) => `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join('')
    )

    return JSON.parse(jsonPayload)
  }

  const isTokenExpired = useCallback(() => {
    if (!adexAccount || !adexAccount.accessToken) {
      return true
    }

    const timeNowInSeconds = Math.floor(new Date().getTime() / 1000)
    const decodeAccessToken = parseJwt(adexAccount.accessToken)
    if (decodeAccessToken.exp < timeNowInSeconds) {
      return true
    }

    return false
  }, [adexAccount])

  // TODO: remove BASE_URL
  const BASE_URL = 'http://localhost:3069'
  const refreshAccessToken = useCallback(async () => {
    const url = `${BASE_URL}/dsp/refresh-token`
    const method = 'POST'
    const body = {
      refreshToken: adexAccount?.refreshToken
    }
    const headers = {
      'Content-Type': 'application/json'
    }

    const req = {
      url,
      method,
      headers,
      body
    }

    return fetchService(req).then(processResponse)
  }, [adexAccount?.refreshToken])

  const fetchAuthRequest = useCallback(
    async (req: any) => {
      if (!adexAccount || !adexAccount.accessToken) {
        throw new Error('Access token not available')
      }

      if (isTokenExpired()) {
        refreshAccessToken().then((response) => {
          if (response) {
            setAdexAccount((prevState) => ({
              ...prevState!,
              accessToken: response.accessToken,
              refreshToken: response.refreshToken
            }))
            const updatedReq = { ...req, 'X-DSP-AUTH': `Bearer ${response.accessToken}` }
            return fetchService(updatedReq).then(processResponse)
          }
        })
      }

      return fetchService(req).then(processResponse)
    },
    [adexAccount, isTokenExpired, refreshAccessToken, setAdexAccount]
  )

  return {
    fetchAuthRequest
  }
}

export default useFetch
