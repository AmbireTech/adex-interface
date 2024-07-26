import { ActionIcon, Flex, createStyles, Tooltip } from '@mantine/core'
import { IActionButtonProps } from 'types'

const useStyles = createStyles((theme) => ({
  actionIcon: {
    '&:hover': {
      color: theme.colors.brand[theme.fn.primaryShade()]
    }
  }
}))

const ActionButton = ({ action, icon, title, children }: IActionButtonProps) => {
  const { classes } = useStyles()
  return (
    <Tooltip label={title}>
      <Flex align="center">
        <ActionIcon
          title={title}
          color="secondaryText"
          variant="transparent"
          onClick={action}
          className={classes.actionIcon}
          mr="md"
        >
          {icon}
        </ActionIcon>
        {children}
      </Flex>
    </Tooltip>
  )
}

export default ActionButton
