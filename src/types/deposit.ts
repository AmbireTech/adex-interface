export enum DepositMethods {
  SendCrypto,
  TopUpFiat
}

export interface ITabSwitchDeposit {
  selectedTab: DepositMethods | null
}
