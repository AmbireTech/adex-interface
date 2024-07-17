import { Grid, Text, GridProps, MantineTheme, lighten, getPrimaryShade } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { useColorScheme } from '@mantine/hooks'
import InfoCurlyBorder from 'resources/icons/InfoCurlyBorder'

type InfoAlertMessageProps = GridProps & {
  message: string
}

const useStyles = createStyles((theme: MantineTheme) => {
  const colorScheme = useColorScheme()
  const primaryShade = getPrimaryShade(theme, colorScheme)

  return {
    errorWrapper: {
      alignItems: 'center',
      border: '1px solid',
      borderColor: theme.colors.decorativeBorders[primaryShade],
      boxShadow: theme.shadows.sm,
      borderRadius: theme.radius.md,
      marginBottom: theme.spacing.xs,
      background: lighten(theme.colors.warning[primaryShade], theme.other.shades.lighten.lightest)
    },
    errorIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 50,
      borderTopLeftRadius: theme.radius.md,
      borderBottomLeftRadius: theme.radius.md,
      color: theme.colors.warning[primaryShade]
    },
    text: {
      background: theme.colors.mainBackground[primaryShade],
      borderTopRightRadius: theme.radius.md,
      borderBottomRightRadius: theme.radius.md
    }
  }
})

const InfoAlertMessage = ({ message, ...rest }: InfoAlertMessageProps) => {
  const { classes } = useStyles()
  return (
    <Grid className={classes.errorWrapper} {...rest}>
      <Grid.Col span="content" className={classes.errorIcon} p={0}>
        <InfoCurlyBorder size="24px" />
      </Grid.Col>
      <Grid.Col span="auto" className={classes.text} p={0}>
        <Text size="sm" m="md">
          {message}
        </Text>
      </Grid.Col>
    </Grid>
  )
}

export default InfoAlertMessage
