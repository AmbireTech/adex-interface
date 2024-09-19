import { Box, Flex, rem, Title, lighten, MantineTheme, getPrimaryShade } from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { useColorScheme } from '@mantine/hooks'
import CheckMarkIcon from 'resources/icons/CheckMark'
import CheckMarkFilledIcon from 'resources/icons/CheckMarkFilled'
import { ICustomCardProps, ICustomCardStyleProps } from 'types'

const useStyles = createStyles(
  (theme: MantineTheme, { color, width, height, border, shadow }: ICustomCardStyleProps) => {
    const colorScheme = useColorScheme()
    const primaryShade = getPrimaryShade(theme, colorScheme)

    return {
      wrapper: {
        transitionTimingFunction: theme.other.transitionTimingFunction,
        transition: 'all 0.3s',
        textAlign: 'center',
        borderRadius: theme.radius.md,
        height: typeof height === 'string' ? height : rem(height),
        width: typeof width === 'string' ? width : rem(width),
        border: border
          ? `1px solid ${theme.colors.decorativeBorders[primaryShade]}`
          : 'transparent',
        boxShadow: !border ? theme.shadows.xs : undefined,
        cursor: shadow || border ? 'pointer' : undefined,
        backgroundColor: border
          ? theme.colors.lightBackground[primaryShade]
          : theme.colors.mainBackground[primaryShade],
        textDecoration: 'none',
        '&:hover': {
          backgroundColor: border ? theme.colors.mainBackground[primaryShade] : 'none',
          boxShadow: theme.shadows.md,
          border: `1px solid ${lighten(
            theme.colors[color][primaryShade],
            theme.other.shades.lighten.lighter
          )}`,
          svg: {
            color: border ? theme.colors[color][primaryShade] : undefined,
            transform: !shadow && !border ? 'scale(1.5)' : 'scale(1)'
          },
          '#text': {
            color: border ? theme.colors.brand[primaryShade] : undefined
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
        color:
          !shadow && !border
            ? theme.colors[color][primaryShade]
            : theme.colors.secondaryText[primaryShade],
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
        color: theme.colors.secondaryText[primaryShade]
      },
      active: {
        backgroundColor: border ? theme.colors.mainBackground[primaryShade] : '',
        boxShadow: theme.shadows.md,
        border: `1px solid ${lighten(
          theme.colors[color][primaryShade],
          theme.other.shades.lighten.lighter
        )}`,
        svg: {
          color: theme.colors[color][primaryShade]
        },
        '#text': {
          color: border ? theme.colors.brand[primaryShade] : undefined
        }
      },

      // NOTE: quick fix for disabled card - needs re-write of the component
      disabled: {
        cursor: 'no-drop',
        border: 0,
        background: theme.colors.gray[3],
        '&:hover': {
          boxShadow: 'none',
          border: 0
        }
      }
    }
  }
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
  hasCheckMark,
  disabled
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
      className={cx(classes.wrapper, { [classes.active]: active, [classes.disabled]: disabled })}
      component={component}
      to={to}
      onClick={!disabled ? action : () => {}}
      p="xs"
      pos="relative"
    >
      {hasCheckMark && (
        <Box pos="absolute" right={4} top={4}>
          {active ? <CheckMarkFilledIcon size="20px" /> : <CheckMarkIcon size="20px" />}
        </Box>
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
