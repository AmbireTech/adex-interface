import { Box, Flex, rem, Title, createStyles } from '@mantine/core'
import { CustomCardType, ICustomCardProps, ICustomCardStyleProps } from 'types'

const useStyles = createStyles(
  (theme, { color, width, height, border, shadow }: ICustomCardStyleProps) => ({
    wrapper: {
      transitionTimingFunction: theme.transitionTimingFunction,
      transition: 'all 0.3s',
      textAlign: 'center',
      borderRadius: theme.radius.md,
      height: typeof height === 'string' ? height : rem(height),
      width: typeof width === 'string' ? width : rem(width),
      border: border
        ? `1px solid ${theme.colors.decorativeBorders[theme.fn.primaryShade()]}`
        : 'transparent',
      boxShadow: !border ? theme.shadows.xs : undefined,
      cursor: shadow || border ? 'pointer' : undefined,
      backgroundColor: border
        ? theme.colors.lightBackground[theme.fn.primaryShade()]
        : theme.colors.mainBackground[theme.fn.primaryShade()],
      textDecoration: 'none',
      '&:hover': {
        backgroundColor: border ? theme.colors.mainBackground[theme.fn.primaryShade()] : 'none',
        boxShadow: theme.shadows.md,
        border: `1px solid ${theme.fn.lighten(
          theme.colors[color][theme.fn.primaryShade()],
          theme.other.shades.lighten.lighter
        )}`,
        svg: {
          color: border ? theme.colors[color][theme.fn.primaryShade()] : undefined,
          transform: !shadow && !border ? 'scale(1.5)' : 'scale(1)'
        },
        '#text': {
          color: border ? theme.colors.brand[theme.fn.primaryShade()] : undefined
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
      color: !shadow ? theme.colors[color][theme.fn.primaryShade()] : undefined,
      svg: {
        transitionTimingFunction: theme.transitionTimingFunction,
        transition: 'transform 0.3s'
      }
    },
    text: {
      display: 'flex',
      maxWidth: !shadow ? '70%' : undefined,
      gap: theme.spacing.md,
      fontSize: !shadow && !border ? theme.fontSizes.xl : undefined,
      color: theme.colors.secondaryText[theme.fn.primaryShade()]
    },
    active: {
      backgroundColor: border ? theme.colors.mainBackground[theme.fn.primaryShade()] : '',
      boxShadow: theme.shadows.md,
      border: `1px solid ${theme.fn.lighten(
        theme.colors[color][theme.fn.primaryShade()],
        theme.other.shades.lighten.lighter
      )}`,
      svg: {
        color: theme.colors[color][theme.fn.primaryShade()]
      },
      '#text': {
        color: border ? theme.colors.brand[theme.fn.primaryShade()] : undefined
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
  variant
}: ICustomCardProps) => {
  const { classes, cx } = useStyles({
    color,
    width,
    height,
    border: variant === CustomCardType.border,
    shadow: variant === CustomCardType.shadow
  })

  return (
    <Box
      className={cx(classes.wrapper, { [classes.active]: active })}
      component={component}
      to={to}
      onClick={action}
    >
      <Flex
        mih={50}
        h="100%"
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
