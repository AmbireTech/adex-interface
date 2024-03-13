import { BASE_URL } from 'constants/login'
import { fetchService } from 'services'
import { IAdExAccount, AppError, ErrorLevel } from 'types'

const processResponse = (res: any) => {
  if (res.status >= 200 && res.status < 400) {
    return res.json()
  }
  // TODO: fix that
  return res.text().then((text: any) => {
    if (res.status === 401 || res.status === 403) {
      throw new Error('something went wrong', text)
    }
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

export const isTokenExpired = (account: IAdExAccount) => {
  if (!account || !account.accessToken) {
    return true
  }

  const timeNowInSeconds = Math.floor(new Date().getTime() / 1000)
  const decodeAccessToken = parseJwt(account.accessToken)
  return decodeAccessToken.exp < timeNowInSeconds
}

export const getMessageToSign = async (user: any) => {
  const url = `${BASE_URL}/dsp/login-msg`
  const method = 'POST'
  const body = {
    wallet: user.address,
    chainId: user.chainId
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
}

type VerifyLoginProps = {
  authMsg: any
  signature: string
}

export const verifyLogin = async (body: VerifyLoginProps) => {
  const url = `${BASE_URL}/dsp/login-verify`
  const method = 'POST'
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
}

export const refreshAccessToken = async (adexAccount: IAdExAccount) => {
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
