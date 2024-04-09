export interface IAdExAccount {
  chainId: number
  address: string
  accessToken: string | null
  refreshToken: string | null
  authenticated: boolean
  authMsgResp?: any
}
