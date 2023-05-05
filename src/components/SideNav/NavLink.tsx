import { ThemeIcon, UnstyledButton, Group, Text } from '@mantine/core'

function NavLink({
  icon,
  label,
  action
}: {
  icon?: React.ReactNode
  label: string
  action?: () => void
}) {
  return (
    <UnstyledButton
      onClick={action}
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.xs,
        borderRadius: theme.radius.sm,
        color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]
        }
      })}
    >
      <Group>
        <ThemeIcon variant="light">{icon}</ThemeIcon>

        <Text size="sm">{label}</Text>
      </Group>
    </UnstyledButton>
  )
}

export default NavLink
