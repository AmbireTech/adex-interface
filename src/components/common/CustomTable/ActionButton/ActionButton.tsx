import { ActionIcon, Flex, MantineTheme, getPrimaryShade } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { useColorScheme } from '@mantine/hooks'
import { IActionButtonProps } from 'types'

const useStyles = createStyles((theme: MantineTheme) => {
  const colorScheme = useColorScheme()
  const primaryShade = getPrimaryShade(theme, colorScheme)
  return {
    actionIcon: {
      '&:hover': {
        color: theme.colors.brand[primaryShade]
      }
    }
  }
})

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
