import { ReactNode } from 'react'

export interface IFiatProviderProps {
  logo: ReactNode
  type: string
  fees: string
  limits: string
  currencies: string
  onClick: () => void
}
