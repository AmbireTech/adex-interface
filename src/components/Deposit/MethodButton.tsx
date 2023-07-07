import { Flex, UnstyledButton, Text, createStyles, MantineColor } from '@mantine/core'

const useStyles = createStyles((theme, { color }: { color: MantineColor }) => ({
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
      background: 'none',
      svg: {
        color: theme.colors[color][theme.fn.primaryShade()]
      }
    }
  },
  active: {
    boxShadow: theme.shadows.sm,
    borderColor: theme.colors[color][theme.fn.primaryShade()],
    color: theme.colors[color][theme.fn.primaryShade()],
    background: 'none',
    svg: {
      color: theme.colors[color][theme.fn.primaryShade()]
    }
  }
}))

const MethodButton = ({
  icon,
  label,
  color,
  active,
  action
}: {
  icon: React.ReactNode
  label: string
  color: MantineColor
  active: boolean
  action: () => void
}) => {
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

export default MethodButton
