import { Box, Flex, rem, Title, Group, lighten } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import CheckMarkIcon from 'resources/icons/CheckMark'
import CheckMarkFilledIcon from 'resources/icons/CheckMarkFilled'
import { ICustomCardProps, ICustomCardStyleProps } from 'types'

const useStyles = createStyles(
  (theme, { color, width, height, border, shadow }: ICustomCardStyleProps) => ({
    wrapper: {
      transitionTimingFunction: theme.other.transitionTimingFunction,
      transition: 'all 0.3s',
      textAlign: 'center',
      borderRadius: theme.radius.md,
      height: typeof height === 'string' ? height : rem(height),
      width: typeof width === 'string' ? width : rem(width),
      border: border ? `1px solid ${theme.colors.decorativeBorders[3]}` : 'transparent',
      boxShadow: !border ? theme.shadows.xs : undefined,
      cursor: shadow || border ? 'pointer' : undefined,
      backgroundColor: border ? theme.colors.lightBackground[3] : theme.colors.mainBackground[3],
      textDecoration: 'none',
      '&:hover': {
        backgroundColor: border ? theme.colors.mainBackground[3] : 'none',
        boxShadow: theme.shadows.md,
        border: `1px solid ${lighten(theme.colors[color][3], theme.other.shades.lighten.lighter)}`,
        svg: {
          color: border ? theme.colors[color][3] : undefined,
          transform: !shadow && !border ? 'scale(1.5)' : 'scale(1)'
        },
        '#text': {
          color: border ? theme.colors.brand[3] : undefined
        }
      }
    },
    iconWrapper: {
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.sm
    },
    icon: {
      display: 'flex',
      alignItems: 'center',
      color: !shadow && !border ? theme.colors[color][3] : theme.colors.secondaryText[3],
      svg: {
        transitionTimingFunction: theme.other.transitionTimingFunction,
        transition: 'transform 0.3s'
      }
    },
    text: {
      display: 'flex',
      maxWidth: !shadow ? '70%' : undefined,
      gap: theme.spacing.md,
      fontSize: !shadow && !border ? theme.fontSizes.xl : undefined,
      color: theme.colors.secondaryText[3]
    },
    active: {
      backgroundColor: border ? theme.colors.mainBackground[3] : '',
      boxShadow: theme.shadows.md,
      border: `1px solid ${lighten(theme.colors[color][3], theme.other.shades.lighten.lighter)}`,
      svg: {
        color: theme.colors[color][3]
      },
      '#text': {
        color: border ? theme.colors.brand[3] : undefined
      }
    }
  })
)

const CustomCard = ({
  icon,
  iconLeft,
  color,
  title,
  text,
  width,
  height,
  children,
  action,
  component,
  to,
  active,
  variant,
  hasCheckMark
}: ICustomCardProps) => {
  const { classes, cx } = useStyles({
    color,
    width,
    height,
    border: variant === 'border',
    shadow: variant === 'shadow'
  })

  return (
    <Box
      className={cx(classes.wrapper, { [classes.active]: active })}
      component={component}
      to={to}
      onClick={action}
    >
      {hasCheckMark && (
        <Group justify="right" pr="xs" pt="xs">
          {active ? <CheckMarkFilledIcon size="20px" /> : <CheckMarkIcon size="20px" />}
        </Group>
      )}
      <Flex
        mih={50}
        h={hasCheckMark ? 'auto' : '100%'}
        p="sm"
        justify="space-around"
        align="center"
        direction="column"
        wrap="wrap"
      >
        {title && <Title order={2}>{title}</Title>}
        {icon && (
          <div className={classes.iconWrapper}>
            <span className={classes.icon}>{icon}</span>
          </div>
        )}
        <span className={classes.text}>
          {iconLeft && <span className={classes.icon}>{iconLeft}</span>}
          <span id="text">{text}</span>
        </span>
        {children}
      </Flex>
    </Box>
  )
}

export default CustomCard
