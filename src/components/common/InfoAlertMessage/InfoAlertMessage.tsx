import { Grid, Text, createStyles, MantineStyleSystemProps } from '@mantine/core'
import InfoCurlyBorder from 'resources/icons/InfoCurlyBorder'

type InfoAlertMessageProps = MantineStyleSystemProps & {
  message: string
}

const useStyles = createStyles((theme) => ({
  errorWrapper: {
    alignItems: 'center',
    border: '1px solid',
    borderColor: theme.colors.decorativeBorders[theme.fn.primaryShade()],
    boxShadow: theme.shadows.sm,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.xs,
    background:
      theme.colors.warning[theme.fn.primaryShade()] + theme.other.shades.hexColorSuffix.lightest
  },
  errorIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    borderTopLeftRadius: theme.radius.md,
    borderBottomLeftRadius: theme.radius.md,
    color: theme.colors.warning[theme.fn.primaryShade()]
  },
  text: {
    background: theme.colors.mainBackground[theme.fn.primaryShade()],
    borderTopRightRadius: theme.radius.md,
    borderBottomRightRadius: theme.radius.md
  }
}))

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
