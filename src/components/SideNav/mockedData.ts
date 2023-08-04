import ethLogo from 'resources/logos/ethereumIcon.png'

import { IAccountBalance } from 'types'

const accountBalance: IAccountBalance = {
  totalInUSD: 42000.69,
  balanceByTokens: [
    {
      id: 1,
      symbol: 'ETH',
      icon: ethLogo,
      amount: 10000,
      network: 'Ethereum'
    },
    {
      id: 2,
      symbol: 'ETH',
      icon: ethLogo,
      amount: 20000,
      network: 'Ethereum'
    },
    {
      id: 3,
      symbol: 'ETH',
      icon: ethLogo,
      amount: 20000,
      network: 'Ethereum'
    },
    {
      id: 4,
      symbol: 'ETH',
      icon: ethLogo,
      amount: 20000,
      network: 'Ethereum'
    }
  ]
}

export { accountBalance }
