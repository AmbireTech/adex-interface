export interface ISeller {
  name: string
  address: string
  city: string
  country: string
  regNumber: string
  vatRegNumber: string
  ethAddress: string
}

export interface IBuyer {
  name: string
  address: string
  city: string
  country: string
  regNumber: string
  vatRegNumber: string
  ethAddress: string
}

export interface IInvoiceData {
  description: string
  unitOfMeasure: string
  quantity: number
  priceInUsd: string
  amountInUsd: string
}

export interface IInvoiceDetails {
  invoiceId: string
  invoiceDate: string
  seller: ISeller
  buyer: IBuyer
  invoiceData: IInvoiceData[]
}
