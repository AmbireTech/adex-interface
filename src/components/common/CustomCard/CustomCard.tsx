import { Box, Flex, rem, Title, createStyles } from '@mantine/core'
import { ICustomCardProps, ICustomCardStyleProps } from 'types'

const useStyles = createStyles(
  (theme, { color, width, height, hasBorder, hasAction }: ICustomCardStyleProps) => ({
    wrapper: {
      transitionTimingFunction: theme.transitionTimingFunction,
      transition: 'all 0.3s',
      textAlign: 'center',
      borderRadius: theme.radius.md,
      height: typeof height === 'string' ? height : rem(height),
      width: typeof width === 'string' ? width : rem(width),
      border: hasBorder
        ? `1px solid ${theme.colors.decorativeBorders[theme.fn.primaryShade()]}`
        : 'transparent',
      boxShadow: !hasBorder ? theme.shadows.xs : undefined,
      cursor: hasAction ? 'pointer' : '',
      backgroundColor: hasBorder
        ? theme.colors.lightBackground[theme.fn.primaryShade()]
        : theme.colors.mainBackground[theme.fn.primaryShade()],
      textDecoration: 'none',
      '&:hover': {
        backgroundColor: hasBorder ? theme.colors.mainBackground[theme.fn.primaryShade()] : 'none',
        boxShadow: !hasBorder ? theme.shadows.md : undefined,
        border: `1px solid ${theme.fn.lighten(
          theme.colors[color][theme.fn.primaryShade()],
          theme.other.shades.lighten.lighter
        )}`,
        svg: {
          color: hasBorder ? theme.colors[color][theme.fn.primaryShade()] : undefined,
          transform: !hasAction ? 'scale(1.5)' : 'scale(1)'
        },
        '#text': {
          color: hasBorder ? theme.colors.brand[theme.fn.primaryShade()] : undefined
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
      color: !hasAction ? theme.colors[color][theme.fn.primaryShade()] : undefined,
      svg: {
        transitionTimingFunction: theme.transitionTimingFunction,
        transition: 'transform 0.3s'
      }
    },
    text: {
      display: 'flex',
      maxWidth: !hasAction ? '70%' : undefined,
      gap: theme.spacing.md,
      fontSize: !hasAction ? theme.fontSizes.xl : undefined,
      color: theme.colors.secondaryText[theme.fn.primaryShade()]
    },
    active: {
      backgroundColor: hasBorder ? theme.colors.mainBackground[theme.fn.primaryShade()] : '',
      boxShadow: !hasBorder ? theme.shadows.md : undefined,
      border: `1px solid ${theme.fn.lighten(
        theme.colors[color][theme.fn.primaryShade()],
        theme.other.shades.lighten.lighter
      )}`,
      svg: {
        color: theme.colors[color][theme.fn.primaryShade()]
      },
      '#text': {
        color: hasBorder ? theme.colors.brand[theme.fn.primaryShade()] : undefined
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
  border
}: ICustomCardProps) => {
  const { classes, cx } = useStyles({
    color,
    width,
    height,
    hasBorder: !!border,
    hasAction: !!action
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
