import {
  Container,
  Grid,
  MantineTheme,
  Select,
  Text,
  getPrimaryShade,
  lighten
} from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { useColorScheme } from '@mantine/hooks'
import { useCallback, useEffect, useMemo, useState } from 'react'
import EthereumIcon from 'resources/networks/Ethereum'
import PolygonIcon from 'resources/networks/Polygon'
import SendCryptoIcon from 'resources/icons/SendCrypto'
import DepositIcon from 'resources/icons/Deposit'
import { DepositMethods, ITabSwitchDeposit } from 'types'
import CustomCard from 'components/common/CustomCard'
import { IS_MANUAL_DEPOSITING } from 'constants/balances'
import { useNavigate } from 'react-router-dom'
import TopUpAccountModal from 'components/common/TopUpAccountModal'
// import SelectItem from './SelectItem'
import SendCryptocurrency from './SendCryptocurrency'
import TopUpWithFiat from './TopUpWithFiat'

const useStyles = createStyles((theme: MantineTheme) => {
  const colorScheme = useColorScheme()
  const primaryShade = getPrimaryShade(theme, colorScheme)
  return {
    container: {
      background: theme.colors.mainBackground[primaryShade],
      boxShadow: theme.shadows.sm,
      borderRadius: theme.radius.sm,
      marginTop: theme.spacing.xl
    },
    center: {
      display: 'flex',
      justifyContent: 'center'
    },
    confirmModalContent: {
      background: lighten(
        theme.colors.attention[primaryShade],
        theme.other.shades.lighten.lightest
      ),
      padding: theme.spacing.xl
    },
    iconWrapper: {
      width: 50,
      height: 50,
      background: `${theme.colors.attention[primaryShade]}1A`,
      borderRadius: '50%',
      padding: theme.spacing.sm
    },
    attentionIcon: {
      width: 25,
      height: 25,
      color: theme.colors.attention[primaryShade]
    },
    root: {
      padding: 0
    }
  }
})

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
  // const icon = useMemo(() => data.find(({ value }) => value === network)?.image, [network])

  const isManualDepositing = useMemo(() => IS_MANUAL_DEPOSITING === 'true', [])
  const [opened, setOpened] = useState(false)
  const navigate = useNavigate()
  const handleModalClicked = useCallback(() => setOpened((prev) => !prev), [])
  const goBack = useCallback(() => {
    navigate(-1)
    handleModalClicked()
  }, [navigate, handleModalClicked])

  useEffect(() => {
    if (isManualDepositing) setOpened(true)
  }, [isManualDepositing, setOpened])

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
            // itemComponent={SelectItem}
            value={network}
            onChange={(value: string | null) => value && setNetwork(value)}
            // icon={icon}
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
      <TopUpAccountModal onCancelClicked={goBack} onConfirmClicked={goBack} opened={opened} />
    </Container>
  )
}

export default Deposit
