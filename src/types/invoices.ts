export interface IInvoices {
  [index: string]: any
  id: number
  companyName: string
  campaignPeriod: {
    from: string
    to: string
  }
  amountSpent: string
}
