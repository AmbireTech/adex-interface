import { Grid, Title, Text } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { IFiatProviderProps } from 'types'

const useStyles = createStyles((theme) => ({
  wrapper: {
    backgroundColor: theme.colors.lightBackground[3],
    border: '1px solid',
    borderColor: theme.colors.decorativeBorders[3],
    borderRadius: theme.radius.sm,
    padding: theme.spacing.xs,
    cursor: 'pointer',
    '&:hover': {
      borderColor: theme.colors.brand[3],
      boxShadow: theme.shadows.md
    }
  },
  fontSizeSmall: {
    fontSize: theme.fontSizes.sm
  }
}))

const FiatProvider = ({ logo, type, fees, limits, currencies, onClick }: IFiatProviderProps) => {
  const { classes } = useStyles()
  return (
    <Grid className={classes.wrapper} align="center" onClick={onClick}>
      <Grid.Col span={4}>{logo}</Grid.Col>
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
