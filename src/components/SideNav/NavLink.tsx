import { UnstyledButton, Group, Text, lighten, MantineTheme } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { Link, LinkProps } from 'react-router-dom'
import CustomPopover from 'components/common/CustomPopover'

const useStyles = createStyles((theme: MantineTheme) => {
  return {
    button: {
      display: 'block',
      width: '100%',
      height: '100%',
      padding: theme.spacing.xs,
      borderRadius: 'none',
      position: 'relative',
      color: lighten(theme.colors.mainText[3], theme.other.shades.lighten.lighter),
      '&:hover': {
        background: theme.colors.lightBackground[3]
      }
    },
    active: {
      backgroundColor: lighten(theme.colors.brand[3], theme.other.shades.lighten.lightest),
      color: theme.colors.brand[3],
      fontWeight: theme.other.fontWeights.regular,
      opacity: 1,
      '&:before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 5,
        backgroundColor: theme.colors.brand[3]
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

type NavLinkProps = LinkProps & {
  to?: string
  icon?: React.ReactNode
  label: string
  action?: () => void
  active?: boolean
  hasPopover?: boolean
  popoverContent?: JSX.Element | string
}

function NavLink({
  to = '',
  icon,
  label,
  action,
  active,
  hasPopover,
  popoverContent = '',
  ...rest
}: NavLinkProps) {
  const { classes, cx } = useStyles()
  return hasPopover ? (
    <CustomPopover popoverContent={popoverContent}>
      <UnstyledButton className={classes.button} px="md">
        <Group>
          <span className={classes.icon}>{icon}</span>
          <Text size="md">{label}</Text>
        </Group>
      </UnstyledButton>
    </CustomPopover>
  ) : (
    <UnstyledButton
      to={to}
      component={Link}
      title={label}
      onClick={action}
      className={cx(classes.button, { [classes.active]: active })}
      px="md"
      {...rest}
    >
      <Group>
        <span className={classes.icon}>{icon}</span>
        <Text size="md">{label}</Text>
      </Group>
    </UnstyledButton>
  )
}

export default NavLink
