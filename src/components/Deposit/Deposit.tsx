import { Container, Grid, Select, createStyles, Text } from '@mantine/core'
import { useMemo, useState } from 'react'
import EthereumIcon from 'resources/networks/Ethereum'
import PolygonIcon from 'resources/networks/Polygon'
import SendCryptoIcon from 'resources/icons/SendCrypto'
import DepositIcon from 'resources/icons/Deposit'
import { DepositMethods, ITabSwitchDeposit } from 'types'
import CustomCard from 'components/common/CustomCard'
import SelectItem from './SelectItem'
import SendCryptocurrency from './SendCryptocurrency'
import TopUpWithFiat from './TopUpWithFiat'

const useStyles = createStyles((theme) => ({
  container: {
    background: theme.colors.mainBackground[theme.fn.primaryShade()],
    boxShadow: theme.shadows.sm,
    borderRadius: theme.radius.sm,
    marginTop: theme.spacing.xl
  },
  center: {
    display: 'flex',
    justifyContent: 'center'
  }
}))

const data = [
  {
    image: <EthereumIcon size="30px" />,
    label: 'Ethereum',
    value: 'ethereum'
  },
  {
    image: <PolygonIcon size="30px" />,
    label: 'Polygon',
    value: 'polygon'
  }
]

const TabSwitch = ({ selectedTab }: ITabSwitchDeposit) => {
  switch (selectedTab) {
    case 'sendCrypto':
      return <SendCryptocurrency />
    case 'topUpFiat':
      return <TopUpWithFiat />
    default:
      return <div />
  }
}

const Deposit = () => {
  const { classes } = useStyles()
  const [network, setNetwork] = useState(data[0].value)
  const [selectedTab, setSelectedTab] = useState<DepositMethods | null>(null)
  const icon = useMemo(() => data.find(({ value }) => value === network)?.image, [network])

  return (
    <Container size="xs" className={classes.container} pt="lg" pb="lg">
      <Grid grow align="center">
        <Grid.Col>
          <Text size="sm" color="secondaryText" fw="bold">
            Select Network
          </Text>
        </Grid.Col>
        <Grid.Col span={12}>
          <Select
            variant="filled"
            data={data}
            itemComponent={SelectItem}
            value={network}
            onChange={(value: string) => setNetwork(value)}
            icon={icon}
          />
        </Grid.Col>
        <Grid.Col>
          <Text size="sm" color="secondaryText" fw="bold">
            Choose Method
          </Text>
        </Grid.Col>
        <Grid.Col span={6} className={classes.center}>
          <CustomCard
            icon={<SendCryptoIcon size="30px" strokeWidth="2" />}
            width="100%"
            height="100%"
            text="Send Cryptocurrency"
            color="brand"
            active={selectedTab === 'sendCrypto'}
            action={() => setSelectedTab('sendCrypto')}
            variant="border"
          />
        </Grid.Col>
        <Grid.Col span={6} className={classes.center}>
          <CustomCard
            icon={<DepositIcon size="30px" strokeWidth="2" />}
            width="100%"
            height="100%"
            text="Top Up with Fiat"
            color="brand"
            active={selectedTab === 'topUpFiat'}
            action={() => setSelectedTab('topUpFiat')}
            variant="border"
          />
        </Grid.Col>
        <Grid.Col span={12}>
          <TabSwitch selectedTab={selectedTab} />
        </Grid.Col>
      </Grid>
    </Container>
  )
}

export default Deposit
