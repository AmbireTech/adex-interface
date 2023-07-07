import { Container, Grid, Select, createStyles, Text } from '@mantine/core'
import { useState } from 'react'
import EthereumIcon from 'resources/networks/Ethereum'
import PolygonIcon from 'resources/networks/Polygon'
import SendCryptoIcon from 'resources/icons/SendCrypto'
import DepositIcon from 'resources/icons/Deposit'
import SelectItem from './SelectItem'
import SendCryptocurrency from './SendCryptocurrency'
import TopUpWithFiat from './TopUpWithFiat'
import MethodButton from './MethodButton'

const useStyles = createStyles((theme) => ({
  container: {
    // change bg color with one from the theme
    background: 'white',
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
    image: <EthereumIcon />,
    label: 'Ethereum',
    value: 'ethereum'
  },
  {
    image: <PolygonIcon />,
    label: 'Polygon',
    value: 'polygon'
  }
]

enum DepositMethods {
  SendCrypto,
  TopUpFiat
}

const TabSwitch = ({ selectedTab }: { selectedTab: DepositMethods | null }) => {
  switch (selectedTab) {
    case DepositMethods.SendCrypto:
      return <SendCryptocurrency />
    case DepositMethods.TopUpFiat:
      return <TopUpWithFiat />
    default:
      return <div />
  }
}

const Deposit = () => {
  const { classes } = useStyles()
  const [network, setNetwork] = useState(data[0].value)
  const [selectedTab, setSelectedTab] = useState<DepositMethods | null>(null)
  const handleTabClicked = (value: DepositMethods) => setSelectedTab(value)
  const handleChange = (value: string) => setNetwork(value)
  const getIcon = () => data.find(({ value }) => value === network)?.image

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
            defaultValue={network}
            onChange={handleChange}
            icon={getIcon()}
          />
        </Grid.Col>
        <Grid.Col>
          <Text size="sm" color="secondaryText" fw="bold">
            Choose Method
          </Text>
        </Grid.Col>
        <Grid.Col span={6} className={classes.center}>
          <MethodButton
            icon={<SendCryptoIcon size="30px" />}
            label="Send Cryptocurrency"
            color="brand"
            active={selectedTab === DepositMethods.SendCrypto}
            action={() => handleTabClicked(DepositMethods.SendCrypto)}
          />
        </Grid.Col>
        <Grid.Col span={6} className={classes.center}>
          <MethodButton
            icon={<DepositIcon size="30px" />}
            label="Top Up with Fiat"
            color="brand"
            active={selectedTab === DepositMethods.TopUpFiat}
            action={() => handleTabClicked(DepositMethods.TopUpFiat)}
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
