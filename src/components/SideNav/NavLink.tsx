import { Button, Divider, ThemeIcon, Group } from '@mantine/core'
import { Link, LinkProps } from 'react-router-dom'

type NavLinkProps = LinkProps & {
  to?: string
  icon?: React.ReactNode
  label: string
  action?: () => void
  active?: boolean
}

function NavLink({ to = '', icon, label, action, active }: NavLinkProps) {
  return (
    <Group wrap="nowrap" align="stretch" justify="stretch" gap="0">
      <Divider orientation="vertical" size={4} color="brand" opacity={active ? '1' : '0'} mr={4} />
      <Button
        radius="sm"
        to={to}
        component={Link}
        title={label}
        onClick={action}
        variant="subtle"
        color={active ? 'brand' : 'secondaryText'}
        fw="normal"
        size="md"
        w="100%"
        justify="flex-start"
        styles={{
          root: {
            pointerEvents: active ? 'none' : 'auto'
          }
        }}
        leftSection={
          <ThemeIcon variant="transparent" c="inherit">
            {icon}
          </ThemeIcon>
        }
      >
        {label}
      </Button>
    </Group>
  )
}

export default NavLink
