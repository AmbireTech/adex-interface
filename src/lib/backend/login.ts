import { BACKEND_BASE_URL } from 'constants/login'
import { fetchService, RequestOptions, getReqErr } from 'services'
import { IAdExAccount, AppError, ErrorLevel } from 'types'

// TODO: fix this to use useAdExApi (adexServicesRequest)

const processResponse = (res: any) => {
  if (res.status >= 200 && res.status < 400) {
    return res.json()
  }
  // TODO: fix that
  return res.text().then((text: any) => {
    if (res.status === 401 || res.status === 403) {
      console.error('unauthorized', text)
    }

    getReqErr(res, text)
  })
}

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

export const isAdminToken = (accessToken: string | null) => {
  if (!accessToken) {
    return false
  }

  const decodeAccessToken = parseJwt(accessToken)

  return decodeAccessToken.data.is_admin
}

export const isTokenExpired = (token: string) => {
  if (!token) {
    return true
  }

  const timeNowInSeconds = Math.floor(new Date().getTime() / 1000)
  const decodeToken = parseJwt(token)
  return decodeToken.exp < timeNowInSeconds
}

export const getMessageToSign = async (user: any) => {
  const url = `${BACKEND_BASE_URL}/dsp/login-msg`
  const method = 'POST'
  const body = {
    wallet: user.address,
    chainId: user.chainId
  }
  const headers = {
    'Content-Type': 'application/json'
  }

  const req: RequestOptions<any> = {
    url,
    method,
    headers,
    body
  }

  return fetchService(req).then(processResponse)
}

type VerifyLoginProps = {
  authMsg: any
  signature: string
}

export const verifyLogin = async (body: VerifyLoginProps) => {
  const url = `${BACKEND_BASE_URL}/dsp/login-verify`
  const method = 'POST'
  const headers = {
    'Content-Type': 'application/json'
  }

  const req: RequestOptions<any> = {
    url,
    method,
    headers,
    body
  }

  return fetchService(req).then(processResponse)
}

export const refreshAccessToken = async (refreshToken: string) => {
  const req: RequestOptions<any> = {
    url: `${BACKEND_BASE_URL}/dsp/refresh-token`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: {
      refreshToken
    }
  }

  return fetchService(req).then(processResponse)
}

export async function registerUser(
  adexUser: IAdExAccount
): Promise<{ adexUser: IAdExAccount | null; error?: AppError }> {
  // TODO: post to backend and return the result as IAdExAccount

  const registered = adexUser?.address && adexUser.chainId ? { ...adexUser } : null
  const error: AppError | undefined = !registered
    ? {
        severity: ErrorLevel.ERROR,
        error: new Error('User data not provided'),
        message: 'User data not provided'
      }
    : undefined
  return { adexUser: registered, error }
}

export async function getAdexAccountByAddress(
  address: string
): Promise<{ identityAccount: IAdExAccount | null; error?: AppError }> {
  // TODO:

  const current: Array<IAdExAccount> = [
    {
      chainId: 1,
      address: '69x70fC54B13FA83571006c289B9A6bbAE69dfD4eA4',
      accessToken: '',
      refreshToken: '',
      authenticated: false
    }
  ]

  return { identityAccount: [...current].find((x) => x.address === address) || null }
}
