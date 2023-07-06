import { Container, Grid, Select, createStyles, Text } from '@mantine/core'
import { useState } from 'react'
import EthereumIcon from 'resources/networks/Ethereum'
import PolygonIcon from 'resources/networks/Polygon'
import CustomCard from 'components/GetStarted/CustomCard'
import SendCryptoIcon from 'resources/icons/SendCrypto'
import DepositIcon from 'resources/icons/Deposit'
import SelectItem from './SelectItem'
import SendCryptocurrency from './SendCryptocurrency'

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
  TopUpWithFiat
}

const TabSwitch = ({ selectedTab }: { selectedTab: DepositMethods | null }) => {
  switch (selectedTab) {
    case DepositMethods.SendCrypto:
      return <SendCryptocurrency />
    case DepositMethods.TopUpWithFiat:
      return <h1>TOP UP FIAT</h1>
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
    <Container size="xs" className={classes.container} pb="lg" pt="lg">
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
          <CustomCard
            width={230}
            height={96}
            icon={<SendCryptoIcon size="30px" />}
            text="Send Cryptocurrency"
            color="brand"
            // active={selectedTab === DepositMethods.SendCrypto}
            action={() => handleTabClicked(DepositMethods.SendCrypto)}
            noGap
          />
        </Grid.Col>
        <Grid.Col span={6} className={classes.center}>
          <CustomCard
            width={230}
            height={96}
            icon={<DepositIcon size="30px" />}
            text="Top Up with Fiat"
            color="brand"
            // active={selectedTab === DepositMethods.TopUpWithFiat}
            action={() => handleTabClicked(DepositMethods.TopUpWithFiat)}
            noGap
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
