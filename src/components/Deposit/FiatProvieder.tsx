import { Grid, Title, Text, createStyles } from '@mantine/core'

const useStyles = createStyles((theme) => ({
  wrapper: {
    // TODO: change bg and border colors
    backgroundColor: theme.colors.lightBackground[theme.fn.primaryShade()],
    border: '1px solid',
    borderColor: theme.colors.decorativeBorders[theme.fn.primaryShade()],
    borderRadius: theme.radius.sm,
    padding: theme.spacing.xs
  },
  fontSizeSmall: {
    fontSize: theme.fontSizes.sm
  }
}))
interface IFiatProviderProps {
  logo: any
  name: string
  type: string
  fees: string
  limits: string
  currencies: string
  onClick: () => void
}

const FiatProvider = ({
  logo,
  name,
  type,
  fees,
  limits,
  currencies,
  onClick
}: IFiatProviderProps) => {
  const { classes } = useStyles()
  return (
    <Grid className={classes.wrapper} align="center" onClick={onClick}>
      <Grid.Col span={4}>
        <img src={logo} alt={name} />
      </Grid.Col>
      <Grid.Col span={8} className={classes.fontSizeSmall}>
        <Title order={6}>{type}</Title>
        <Text>Fees: {fees}</Text>
        <Text>Limits: {limits}</Text>
        <Text>Currencies: {currencies}</Text>
      </Grid.Col>
    </Grid>
  )
}

export default FiatProvider
