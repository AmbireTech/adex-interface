import { Box } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { TimeInput } from '@mantine/dates'

const useStyles = createStyles((theme) => ({
  timeWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: theme.colors.lightBackground[3],
    height: 284,
    width: '100%',
    borderRadius: theme.radius.md
  },
  input: {
    background: theme.colors.mainBackground[3],
    border: '1px solid',
    borderColor: theme.colors.decorativeBorders[3],
    color: theme.colors.mainText[3],
    fontSize: 50,
    lineHeight: 'inherit',
    fontFamily: 'monospace',
    padding: '2.5rem',
    '&:focus': {
      borderColor: theme.colors.brand[3],
      color: theme.colors.brand[3]
    }
  }
}))

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
