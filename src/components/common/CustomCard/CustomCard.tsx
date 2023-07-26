import { Box, Flex, rem, Title, createStyles } from '@mantine/core'
import { CustomCardType, ICustomCardProps, ICustomCardStyleProps } from 'types'

const useStyles = createStyles(
  (theme, { color, width, height, isDepositBtn, isBillingBtn }: ICustomCardStyleProps) => ({
    wrapper: {
      transitionTimingFunction: theme.transitionTimingFunction,
      transition: 'all 0.3s',
      textAlign: 'center',
      borderRadius: theme.radius.md,
      height: typeof height === 'string' ? height : rem(height),
      width: typeof width === 'string' ? width : rem(width),
      border: isDepositBtn
        ? `1px solid ${theme.colors.decorativeBorders[theme.fn.primaryShade()]}`
        : 'transparent',
      boxShadow: !isDepositBtn ? theme.shadows.xs : undefined,
      cursor: isBillingBtn ? 'pointer' : undefined,
      backgroundColor: isDepositBtn
        ? theme.colors.lightBackground[theme.fn.primaryShade()]
        : theme.colors.mainBackground[theme.fn.primaryShade()],
      textDecoration: 'none',
      '&:hover': {
        backgroundColor: isDepositBtn
          ? theme.colors.mainBackground[theme.fn.primaryShade()]
          : 'none',
        boxShadow: !isDepositBtn ? theme.shadows.md : undefined,
        border: `1px solid ${theme.fn.lighten(
          theme.colors[color][theme.fn.primaryShade()],
          theme.other.shades.lighten.lighter
        )}`,
        svg: {
          color: isDepositBtn ? theme.colors[color][theme.fn.primaryShade()] : undefined,
          transform: !isBillingBtn ? 'scale(1.5)' : 'scale(1)'
        },
        '#text': {
          color: isDepositBtn ? theme.colors.brand[theme.fn.primaryShade()] : undefined
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
      color: !isBillingBtn ? theme.colors[color][theme.fn.primaryShade()] : undefined,
      svg: {
        transitionTimingFunction: theme.transitionTimingFunction,
        transition: 'transform 0.3s'
      }
    },
    text: {
      display: 'flex',
      maxWidth: !isBillingBtn ? '70%' : undefined,
      gap: theme.spacing.md,
      fontSize: !isBillingBtn && !isDepositBtn ? theme.fontSizes.xl : undefined,
      color: theme.colors.secondaryText[theme.fn.primaryShade()]
    },
    active: {
      backgroundColor: isDepositBtn ? theme.colors.mainBackground[theme.fn.primaryShade()] : '',
      boxShadow: !isDepositBtn ? theme.shadows.md : undefined,
      border: `1px solid ${theme.fn.lighten(
        theme.colors[color][theme.fn.primaryShade()],
        theme.other.shades.lighten.lighter
      )}`,
      svg: {
        color: theme.colors[color][theme.fn.primaryShade()]
      },
      '#text': {
        color: isDepositBtn ? theme.colors.brand[theme.fn.primaryShade()] : undefined
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
  type
}: ICustomCardProps) => {
  const { classes, cx } = useStyles({
    color,
    width,
    height,
    isDepositBtn: type === CustomCardType.depositBtn,
    isBillingBtn: type === CustomCardType.billingBtn
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
