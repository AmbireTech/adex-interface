import { BaseAnalyticsData, BillingDetails } from 'types'

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
