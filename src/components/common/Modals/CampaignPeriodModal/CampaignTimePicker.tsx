import { Box, MantineTheme, getPrimaryShade } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { TimeInput } from '@mantine/dates'
import { useColorScheme } from '@mantine/hooks'

const useStyles = createStyles((theme: MantineTheme) => {
  const colorScheme = useColorScheme()
  const primaryShade = getPrimaryShade(theme, colorScheme)

  return {
    timeWrapper: {
      display: 'flex',
      alignItems: 'center',
      background: theme.colors.lightBackground[primaryShade],
      height: 284,
      width: '100%',
      borderRadius: theme.radius.md
    },
    input: {
      background: theme.colors.mainBackground[primaryShade],
      border: '1px solid',
      borderColor: theme.colors.decorativeBorders[primaryShade],
      color: theme.colors.mainText[primaryShade],
      fontSize: 50,
      lineHeight: 'inherit',
      fontFamily: 'monospace',
      padding: '2.5rem',
      '&:focus': {
        borderColor: theme.colors.brand[primaryShade],
        color: theme.colors.brand[primaryShade]
      }
    }
  }
})

function CampaignTimePicker({
  defaultValue,
  onChange
}: {
  defaultValue: string
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined
}) {
  const { classes } = useStyles()

  return (
    <Box className={classes.timeWrapper}>
      <TimeInput
        aria-label="Time Input"
        variant="unstyled"
        mx="auto"
        onChange={onChange}
        classNames={{ input: classes.input }}
        defaultValue={defaultValue}
      />
    </Box>
  )
}

export default CampaignTimePicker
