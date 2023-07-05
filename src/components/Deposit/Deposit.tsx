import { Container, Grid, Select, createStyles } from '@mantine/core'
import { useState } from 'react'
import EthereumIcon from 'resources/networks/Ethereum'
import PolygonIcon from 'resources/networks/Polygon'
import CustomCard from 'components/GetStarted/CustomCard'
import SendCryptoIcon from 'resources/icons/SendCrypto'
import DepositIcon from 'resources/icons/Deposit'
import SelectItem from './SelectItem'

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

const Deposit = () => {
  const { classes } = useStyles()
  const [network, setNetwork] = useState(data[0].value)
  const handleChange = (value: string) => setNetwork(value)
  const getIcon = () => {
    return data.find(({ value }) => value === network)?.image
  }

  return (
    <Container size="xs" className={classes.container} pb="lg" pt="lg">
      <Grid grow align="center">
        <Grid.Col span={12}>
          <Select
            variant="filled"
            label="Select Network"
            data={data}
            itemComponent={SelectItem}
            defaultValue={network}
            onChange={handleChange}
            icon={getIcon()}
          />
        </Grid.Col>
        <Grid.Col span={6} className={classes.center}>
          <CustomCard
            width={230}
            height={96}
            icon={<SendCryptoIcon size="30px" />}
            text="Send Cryptocurrency"
            color="brand"
            action={() => console.log('Desktop clicked')}
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
            action={() => console.log('Desktop clicked')}
            noGap
          />
        </Grid.Col>
      </Grid>
    </Container>
  )
}

export default Deposit
