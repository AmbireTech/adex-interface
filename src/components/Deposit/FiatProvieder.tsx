import { Grid, Title, Text, MantineTheme, getPrimaryShade } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { useColorScheme } from '@mantine/hooks'
import { IFiatProviderProps } from 'types'

const useStyles = createStyles((theme: MantineTheme) => {
  const colorScheme = useColorScheme()
  const primaryShade = getPrimaryShade(theme, colorScheme)

  return {
    wrapper: {
      backgroundColor: theme.colors.lightBackground[primaryShade],
      border: '1px solid',
      borderColor: theme.colors.decorativeBorders[primaryShade],
      borderRadius: theme.radius.sm,
      padding: theme.spacing.xs,
      cursor: 'pointer',
      '&:hover': {
        borderColor: theme.colors.brand[primaryShade],
        boxShadow: theme.shadows.md
      }
    },
    fontSizeSmall: {
      fontSize: theme.fontSizes.sm
    }
  }
})

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
