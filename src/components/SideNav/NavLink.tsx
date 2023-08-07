import { UnstyledButton, Group, Text, createStyles } from '@mantine/core'
import { Link } from 'react-router-dom'

const useStyles = createStyles((theme) => {
  return {
    button: {
      display: 'block',
      width: '100%',
      height: '100%',
      padding: theme.spacing.xs,
      borderRadius: 'none',
      position: 'relative',
      color: theme.fn.lighten(
        theme.colors.mainText[theme.fn.primaryShade()],
        theme.other.shades.lighten.lighter
      ),
      '&:hover': {
        background: theme.colors.lightBackground[theme.fn.primaryShade()]
      }
    },
    active: {
      // backgroundColor: theme.fn.primaryColor() + theme.other.shades.hexColorSuffix.lightest,
      color: theme.fn.primaryColor(),
      fontWeight: theme.other.fontWeights.regular,
      opacity: 1,
      '&:before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 5,
        backgroundColor: theme.fn.primaryColor()
      }
    },
    icon: {
      height: 26,
      width: 26,
      display: 'flex',
      alignItems: 'center',
      marginRight: theme.spacing.xs
    }
  }
})

function NavLink({
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
        <span className={classes.icon}>{icon}</span>
        <Text size="lg">{label}</Text>
      </Group>
    </UnstyledButton>
  )
}

export default NavLink
