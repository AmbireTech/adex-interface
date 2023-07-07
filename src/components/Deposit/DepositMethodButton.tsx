import { Flex, UnstyledButton, Text, createStyles } from '@mantine/core'
import { IDepositMethodButtonProps, IDepositMethodButtonStylesProps } from 'types'

const useStyles = createStyles((theme, { color }: IDepositMethodButtonStylesProps) => ({
  methodButton: {
    height: '100%',
    width: '100%',
    backgroundColor: theme.colors.lightBackground[theme.fn.primaryShade()],
    border: `1px solid ${theme.colors.decorativeBorders[theme.fn.primaryShade()]}`,
    padding: theme.spacing.md,
    borderRadius: theme.radius.sm,
    '&:hover': {
      boxShadow: theme.shadows.sm,
      borderColor: theme.colors[color][theme.fn.primaryShade()],
      color: theme.colors[color][theme.fn.primaryShade()],
      background: theme.colors.mainBackground[theme.fn.primaryShade()],
      svg: {
        color: theme.colors[color][theme.fn.primaryShade()]
      }
    }
  },
  active: {
    boxShadow: theme.shadows.sm,
    borderColor: theme.colors[color][theme.fn.primaryShade()],
    color: theme.colors[color][theme.fn.primaryShade()],
    background: theme.colors.mainBackground[theme.fn.primaryShade()],
    svg: {
      color: theme.colors[color][theme.fn.primaryShade()]
    }
  }
}))

const DepositMethodButton = ({ icon, label, color, active, action }: IDepositMethodButtonProps) => {
  const { classes, cx } = useStyles({ color })
  return (
    <UnstyledButton
      className={cx(classes.methodButton, { [classes.active]: active })}
      onClick={action}
    >
      <Flex direction="column" justify="center" align="center" gap="sm">
        {icon}
        <Text>{label}</Text>
      </Flex>
    </UnstyledButton>
  )
}

export default DepositMethodButton
