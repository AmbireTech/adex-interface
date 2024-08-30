export interface LibJwtPayload {
  [key: string]: any
  iss?: string | undefined
  sub?: string | undefined
  aud?: string | string[] | undefined
  exp?: number | undefined
  nbf?: number | undefined
  iat?: number | undefined
  jti?: string | undefined
}

export enum JwtType {
  ACCESS = 'access',
  REFRESH = 'refresh'
}
interface PayloadData {
  user_id: string
  active_account_id: string
  is_admin: boolean
  is_dsp?: boolean
}

interface JwtPayload extends LibJwtPayload {
  data: PayloadData
  type: JwtType
  exp: number
}

const parseJwt = (token: string): JwtPayload => {
  const base64Url = token.split('.')[1]
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
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

export const isTokenExpired = (token: string, extraSecondsBeforeExpiry: number = 0) => {
  if (!token) {
    return true
  }

  const timeNowInSeconds = new Date().getTime() / 1000
  const { exp } = parseJwt(token)
  const isAboutToExpire = exp - extraSecondsBeforeExpiry < timeNowInSeconds
  return isAboutToExpire
}

export const getJWTExpireTime = (token: string, extraSecondsBeforeExpiry: number = 0): number => {
  const { exp } = parseJwt(token)
  const expireTime = (exp - extraSecondsBeforeExpiry) * 1000
  return expireTime
}
