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
