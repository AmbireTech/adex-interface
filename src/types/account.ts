// TODO: These types should get from adex-common

export interface BillingDetails {
  firstName: string
  lastName: string
  companyName: string
  companyNumber: string
  companyNumberPrim: string
  companyAddress: string
  companyCountry: string
  companyCity: string
  companyZipCode: string
  verified?: boolean
}

export interface Token {
  name: string
  address: string
  decimals: number
  chainId: number
}

export interface UserFunds {
  amount: bigint
  token: Token
  txHash: string
  created: Date
}

export type Deposit = UserFunds & {}

export type Withdraw = UserFunds & {}

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

type AccountInfo = {
  notes: string
  email: string
  phone: string
  contactPerson: string
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
  fundsWithdrawn: {
    total: bigint
    withdrawals: Withdraw[]
  }
  fundsOnCampaigns: {
    total: bigint
    perCampaign: CampaignFundsActive[]
  }
  refundsFromCampaigns: {
    total: bigint
    perCampaign: CampaignRefunds[]
  }
  billingDetails: BillingDetails
  created: Date
  updated: Date
  info?: AccountInfo
  [x: string]: any
}

export interface IAdExAccount {
  chainId: number
  address: string
  accessToken: string | null
  refreshToken: string | null
}

export type AdminTransferType = 'deposit' | 'withdraw'

export type AdminTransfer = {
  accountId: string
  amount: number
  token: {
    name: string
    chainId: number
    address: string
    decimals: number
  }
  txHash: string
}
