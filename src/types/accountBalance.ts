export interface IBalanceByTokens {
  [index: string]: any
  id: number
  symbol: string
  icon: string
  network: string
}

export interface IAccountBalance {
  totalInUSD: number
  balanceByTokens: IBalanceByTokens[] | []
}
