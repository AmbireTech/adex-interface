import {
  BaseAnalyticsData,
  BillingDetails,
  Deposit,
  CampaignFundsActive,
  CampaignRefunds
} from 'types'

export interface IInvoices {
  [index: string]: any
  id: string
  companyName: string
  campaignPeriod: {
    from: string
    to: string
  }
  amountSpent: string
}

export type InvoiceCompanyDetails = BillingDetails & {
  ethAddress: string
}

export interface IInvoiceDetails {
  invoiceId: string
  invoiceDate: Date
  seller: InvoiceCompanyDetails
  buyer: InvoiceCompanyDetails
  invoiceData: BaseAnalyticsData[]
  vatPercentageInUSD: number
  currencyName: string
}

export type OperationEntry = (Deposit | CampaignFundsActive | CampaignRefunds) & {
  date: Date
  type: 'deposit' | 'campaign' | 'refund'
  id: string
}

export type StatementData = {
  periodIndex: string
  tokenIndex: string
  operations: OperationEntry[]
  startBalance: bigint
  endBalance: bigint
  token: OperationEntry['token']
}
