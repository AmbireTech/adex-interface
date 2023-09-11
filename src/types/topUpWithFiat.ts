export interface IPaymentProviders {
  logo: any
  name: string
  type: string
  fees: string
  limits: string
  currencies: string
  networks: string[]
  onClick: () => void
}
