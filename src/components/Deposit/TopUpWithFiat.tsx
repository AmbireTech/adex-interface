import { Alert, Grid } from '@mantine/core'
import InfoIcon from 'resources/icons/Info'

import GUARDARIAN_LOGO from 'resources/payment-providers/guardarian.svg'
import MOONPAY_LOGO from 'resources/payment-providers/moonpay.svg'
import PAYTRIE_LOGO from 'resources/payment-providers/paytrie.svg'
import RAMP_LOGO from 'resources/payment-providers/ramp.svg'
import FiatProvider from './FiatProvieder'

interface IPaymentProviders {
  logo: any
  name: string
  type: string
  fees: string
  limits: string
  currencies: string
  networks: string[]
  onClick: () => void
}

const TopUpWithFiat = () => {
  const providers: IPaymentProviders[] = [
    {
      logo: GUARDARIAN_LOGO,
      name: 'Guardarian',
      type: 'Buy with Bank Transfer, Credit/Debit Card, Sell Crypto',
      fees: 'from 2%',
      limits: 'up to 15k EUR/monthly on and off ramp',
      currencies: 'GBP, EUR, USD and many more',
      networks: ['ethereum', 'polygon', 'binance-smart-chain', 'fantom'],
      //   onClick: () => openGuardarian(initMode, selectedAsset)
      onClick: () => console.log('open Guardarian')
    },
    {
      logo: MOONPAY_LOGO,
      name: 'MoonPay',
      type: 'Credit / Debit card',
      fees: 'from 1%',
      limits: '',
      currencies: 'EUR, USD, GBP and many more',
      networks: ['ethereum'],
      //   onClick: () => openMoonpay(initMode, selectedAsset)
      onClick: () => console.log('open Moonpay')
    },
    {
      logo: RAMP_LOGO,
      name: 'Ramp',
      type: 'Bank Transfer, Credit/Debit Card, Apple Pay',
      fees: '0.49%-2.9%',
      limits: '10,000EUR/m',
      currencies: 'USD, EUR, GBP',
      networks: ['ethereum', 'polygon', 'avalanche', 'binance-smart-chain', 'gnosis'],
      // onClick: () => openRampNetwork()
      onClick: () => console.log('open Ramp')
    },
    {
      logo: PAYTRIE_LOGO,
      name: 'PayTrie',
      type: 'Bank Transfer',
      fees: '1% (min. $2 CAD)',
      limits: '$2,000CAD/day',
      currencies: 'CAD',
      networks: ['ethereum', 'polygon', 'binance-smart-chain'],
      //   onClick: () => openPayTrie()
      onClick: () => console.log('open Paytrie')
    }
  ]
  return (
    <Grid align="center">
      <Grid.Col>
        <Alert icon={<InfoIcon size="1rem" />} color="red">
          AdEx operates only with ADX, USDC, USDT or DAI. Please make sure you deposit only these
          coins.
        </Alert>
      </Grid.Col>
      {/* <Grid.Col> */}
      {providers.map(({ logo, name, type, fees, limits, currencies, onClick }) => (
        <Grid.Col p="md">
          <FiatProvider
            key={name}
            logo={logo}
            name={name}
            type={type}
            fees={fees}
            limits={limits}
            currencies={currencies}
            onClick={onClick}
          />
        </Grid.Col>
      ))}
      {/* </Grid.Col> */}
    </Grid>
  )
}

export default TopUpWithFiat
