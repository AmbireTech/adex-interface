import { ActionIcon, Flex } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { IActionButtonProps } from 'types'

const useStyles = createStyles((theme) => ({
  actionIcon: {
    '&:hover': {
      color: theme.colors.brand[3]
    }
  }
}))

const ActionButton = ({ action, icon, title, children }: IActionButtonProps) => {
  const { classes } = useStyles()
  return (
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
  )
}

export default ActionButton
