// TODO: These types should get from adex-common

export interface BillingDetailsProps {
  firstName: string
  lastName: string
  companyName: string
  companyNumber: string
  companyNumberPrim: string
  companyAddress: string
  companyCountry: string
  companyCity: string
  companyZipCode: string
}

export interface Token {
  name: string
  address: string
  decimals: number
  chainId: number
}

export interface Deposit {
  amount: bigint
  token: Token
  txHash: string
  created: Date
}

export interface CampaignFunds {
  id: string
  token: Token
  amount: bigint
}

export interface CampaignFundsActive extends CampaignFunds {
  startDate: Date
}

export interface CampaignRefunds extends CampaignFunds {
  closeDate: Date
}

export interface Account {
  id: string
  name: string
  active: boolean
  availableBalance: bigint
  balanceToken: Token
  fundsDeposited: {
    total: bigint
    deposits: Deposit[]
  }
  fundsOnCampaigns: {
    total: bigint
    perCampaign: CampaignFundsActive[]
  }
  refundsFromCampaigns: {
    total: bigint
    perCampaign: CampaignRefunds[]
  }
  billingDetails: BillingDetailsProps
  created: Date
  updated: Date
  [x: string]: any
}

export interface IAdExAccount {
  chainId: number
  address: string
  accessToken: string | null
  refreshToken: string | null
  authenticated: boolean
  authMsgResp?: any
}
