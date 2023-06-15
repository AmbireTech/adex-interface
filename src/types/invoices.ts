export interface IInvoices {
  [index: string]: any
  companyName: string
  campaignPeriod: {
    from: string
    to: string
  }
  amountSpent: string
}
