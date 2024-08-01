import { ActionIcon, Flex, MantineTheme, getPrimaryShade, Tooltip, FlexProps } from '@mantine/core'
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

const ActionButton = ({
  action,
  icon,
  title,
  children,
  ...rest
}: IActionButtonProps & FlexProps) => {
  const { classes } = useStyles()
  return (
    <Tooltip label={title}>
      <Flex align="center" {...rest}>
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
