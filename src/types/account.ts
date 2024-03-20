export interface IAdExAccount {
  chainId: number
  address: string
  accessToken?: string
  refreshToken?: string
  authenticated: boolean
  authMsgResp?: any
}
