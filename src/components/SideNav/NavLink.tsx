import { Group, Text, ActionIcon, ThemeIcon } from '@mantine/core'

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
    <ActionIcon
      title={label}
      onClick={action}
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        height: '100%',
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
        <ThemeIcon variant="outline" color="blue">
          {icon}
        </ThemeIcon>

        <Text size="sm">{label}</Text>
      </Group>
    </ActionIcon>
  )
}

export default NavLink
