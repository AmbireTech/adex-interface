import { MutableRefObject, useRef } from 'react'
import { Box, createStyles } from '@mantine/core'
import { TimeInput } from '@mantine/dates'
// import TimeIcon from 'resources/icons/Time'

const useStyles = createStyles((theme) => ({
  timeWrapper: {
    display: 'flex',
    alignItems: 'center',
    background: theme.colors.lightBackground[theme.fn.primaryShade()],
    height: 284,
    width: '100%',
    borderRadius: theme.radius.md
  },
  input: {
    background: theme.colors.mainBackground[theme.fn.primaryShade()],
    border: '1px solid',
    borderColor: theme.colors.decorativeBorders[theme.fn.primaryShade()],
    color: theme.colors.mainText[theme.fn.primaryShade()],
    fontSize: 50,
    lineHeight: 'inherit',
    fontFamily: 'monospace',
    padding: '2.5rem',
    '&:focus': {
      borderColor: theme.colors.brand[theme.fn.primaryShade()],
      color: theme.colors.brand[theme.fn.primaryShade()]
    }
  }
}))

function CampaignTimePicker({
  onChange
}: {
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined
}) {
  const { classes } = useStyles()
  const ref: MutableRefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null)

  return (
    <Box className={classes.timeWrapper}>
      <TimeInput
        variant="unstyled"
        ref={ref}
        mx="auto"
        onChange={onChange}
        classNames={{ input: classes.input }}
      />
    </Box>
  )
}

export default CampaignTimePicker
