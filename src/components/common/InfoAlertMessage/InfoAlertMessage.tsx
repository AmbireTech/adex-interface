import { Text, MantineTheme, lighten, getPrimaryShade, Flex, FlexProps } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { useColorScheme } from '@mantine/hooks'
import InfoCurlyBorder from 'resources/icons/InfoCurlyBorder'

type InfoAlertMessageProps = FlexProps & {
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
      background: lighten(theme.colors.warning[primaryShade], theme.other.shades.lighten.lightest)
    },
    errorIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 50,
      height: '100%',
      borderTopLeftRadius: theme.radius.md,
      borderBottomLeftRadius: theme.radius.md,
      color: theme.colors.warning[primaryShade],
      padding: theme.spacing.sm
    },
    text: {
      flexGrow: 3,
      background: theme.colors.mainBackground[primaryShade],
      borderTopRightRadius: theme.radius.md,
      borderBottomRightRadius: theme.radius.md,
      padding: theme.spacing.md
    }
  }
})

const InfoAlertMessage = ({ message, ...rest }: InfoAlertMessageProps) => {
  const { classes } = useStyles()
  return (
    <Flex
      direction="row"
      justify="space-between"
      className={classes.errorWrapper}
      wrap="nowrap"
      {...rest}
    >
      <div className={classes.errorIcon}>
        <InfoCurlyBorder size="24px" />
      </div>
      <div className={classes.text}>
        <Text size="sm">{message}</Text>
      </div>
    </Flex>
  )
}

export default InfoAlertMessage
