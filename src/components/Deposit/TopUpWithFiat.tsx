import { Alert, Grid, Text } from '@mantine/core'
import InfoIcon from 'resources/icons/Info'

import { IPaymentProviders } from 'types'
import GuardarianLogo from 'resources/payment-providers/GuardarianLogo'
import MoonpayLogo from 'resources/payment-providers/MoonpayLogo'
import RampLogo from 'resources/payment-providers/RampLogo'
import PaytrieLogo from 'resources/payment-providers/Paytrie'
import FiatProvider from './FiatProvieder'

const TopUpWithFiat = () => {
  const providers: IPaymentProviders[] = [
    {
      logo: <GuardarianLogo />,
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
      logo: <MoonpayLogo />,
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
      logo: <RampLogo />,
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
      logo: <PaytrieLogo />,
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
        <Alert icon={<InfoIcon />} color="attention" variant="outline">
          AdEx operates only with ADX, USDC, USDT or DAI. Please make sure you deposit only these
          coins.
        </Alert>
      </Grid.Col>
      {/* <Grid.Col>
        <Alert icon={<InfoIcon size="1rem" />} color="attention" variant="outline">
          Note that invoices are generated in the currency in which the campaign was initiated.
        </Alert>
      </Grid.Col> */}
      <Grid.Col>
        <Text size="sm" color="secondaryText" fw="bold">
          Deposit with credit card to your account directly using one of our partners
        </Text>
      </Grid.Col>
      {providers.map(({ logo, name, type, fees, limits, currencies, onClick }) => (
        <Grid.Col p="md" key={name}>
          <FiatProvider
            key={name}
            logo={logo}
            type={type}
            fees={fees}
            limits={limits}
            currencies={currencies}
            onClick={onClick}
          />
        </Grid.Col>
      ))}
    </Grid>
  )
}

export default TopUpWithFiat
