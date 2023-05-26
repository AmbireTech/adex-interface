import { UnstyledButton, Group, Text, ThemeIcon, createStyles } from '@mantine/core'
import { Link } from 'react-router-dom'

const useStyles = createStyles((theme) => {
  return {
    button: {
      display: 'block',
      width: '100%',
      height: '100%',
      padding: theme.spacing.xs,
      borderRadius: 'none',
      position: 'relative'
    },
    active: {
      backgroundColor: theme.fn.lighten(theme.fn.primaryColor(), 0.8),
      '&:before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 5,
        backgroundColor: theme.fn.primaryColor()
      }
    }
  }
})

function CNavLink({
  to = '',
  icon,
  label,
  action,
  active
}: {
  to?: string
  icon?: React.ReactNode
  label: string
  action?: () => void
  active?: boolean
}) {
  const { classes, cx } = useStyles()
  return (
    <UnstyledButton
      to={to}
      component={Link}
      title={label}
      onClick={action}
      className={cx(classes.button, { [classes.active]: active })}
      px="xl"
    >
      <Group>
        <ThemeIcon variant="outline" color="blue">
          {icon}
        </ThemeIcon>

        <Text size="lg">{label}</Text>
      </Group>
    </UnstyledButton>
  )
}

export default CNavLink
