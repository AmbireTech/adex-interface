import { BillingDetails, Deposit, CampaignFundsActive, CampaignRefunds } from 'types'

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
  paymentDate: Date
  seller: InvoiceCompanyDetails & { email: string; website: string }
  buyer: InvoiceCompanyDetails
  vatPercentageInUSD: number
  currencyName: string
  amount: number
  impressions: number
  clicks: number
  avgCpm?: number
  ctr?: number
}

export type OperationEntryType = 'deposit' | 'campaignOpen' | 'campaignRefund'

export type OperationEntry = (Deposit | CampaignFundsActive | CampaignRefunds) & {
  id: string
  type: OperationEntryType
  name: string
  date: Date
  amount: bigint
}

export type StatementData = {
  periodIndex: string
  tokenIndex: string
  operations: OperationEntry[]
  startBalance: bigint
  endBalance: bigint
  token: OperationEntry['token']
}
