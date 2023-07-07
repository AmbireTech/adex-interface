import { Box, Group, Text, Flex, rem, Title, createStyles, MantineColor } from '@mantine/core'

interface StylesProps {
  color: MantineColor
  width: number
  height: number
  hasAction: boolean
}

const useStyles = createStyles((theme, { color, width, height, hasAction }: StylesProps) => ({
  wrapper: {
    transitionTimingFunction: theme.transitionTimingFunction,
    transition: 'all 0.3s',
    textAlign: 'center',
    borderRadius: theme.radius.md,
    height: `${rem(height)}`,
    width: `${rem(width)}`,
    border: 'transparent',
    boxShadow: theme.shadows.xs,
    cursor: hasAction ? 'pointer' : '',
    '&:hover': {
      boxShadow: theme.shadows.md,
      border: `1px solid ${theme.fn.lighten(
        theme.colors[color][theme.fn.primaryShade()],
        theme.other.shades.lighten.lighter
      )}`,
      svg: {
        transform: !hasAction ? 'scale(1.5)' : 'scale(1)'
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
    color: theme.colors[color][theme.fn.primaryShade()],
    svg: {
      transitionTimingFunction: theme.transitionTimingFunction,
      transition: 'transform 0.3s'
    }
  }
}))

const CustomCard = ({
  icon,
  iconLeft,
  color,
  title,
  text,
  width,
  height,
  children,
  action
}: {
  icon?: React.ReactNode
  iconLeft?: React.ReactNode
  color: MantineColor
  title?: string
  text: string
  width: number
  height: number
  children?: React.ReactNode
  action?: () => void
}) => {
  const { classes } = useStyles({ color, width, height, hasAction: !!action })

  return (
    <Box className={classes.wrapper} onClick={action}>
      <Flex
        mih={50}
        h="inherit"
        gap="md"
        justify="center"
        align="center"
        direction="column"
        wrap="wrap"
      >
        {title && <Title order={2}>{title}</Title>}
        {icon && (
          <Box className={classes.iconWrapper}>
            <span className={classes.icon}>{icon}</span>
          </Box>
        )}
        {iconLeft && text ? (
          <Group position="center">
            <span className={classes.icon}>{iconLeft}</span>
            <Text size="lg" align="start" maw={rem(160)}>
              {text}
            </Text>
          </Group>
        ) : (
          <Group position="apart">
            <Text size="xl" inline maw={rem(160)} color="secondaryText">
              {text}
            </Text>
          </Group>
        )}
        {children}
      </Flex>
    </Box>
  )
}

export default CustomCard
