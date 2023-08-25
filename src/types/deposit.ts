export type DepositMethods = 'sendCrypto' | 'topUpFiat'

export interface ITabSwitchDeposit {
  selectedTab: DepositMethods | null
}
