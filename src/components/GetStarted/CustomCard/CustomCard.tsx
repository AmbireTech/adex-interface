import { Box, Group, Text, Flex, rem, Title, createStyles, MantineColor } from '@mantine/core'
import { useHover } from '@mantine/hooks'

interface StylesProps {
  color: MantineColor
  hovered: boolean
  width: number
  height: number
  hasAction: boolean
}

const useStyles = createStyles(
  (theme, { color, hovered, width, height, hasAction }: StylesProps) => ({
    wrapper: {
      transition: `all ${theme.transitionTimingFunction}`,
      textAlign: 'center',
      borderRadius: theme.radius.md,
      height: `${rem(height)}`,
      width: `${rem(width)}`,
      border: hovered
        ? `1px solid ${theme.fn.lighten(
            theme.colors[color][theme.fn.primaryShade()],
            theme.other.shades.lighten.lighter
          )}`
        : 'transparent',
      boxShadow: hovered ? theme.shadows.md : theme.shadows.xs,
      cursor: hasAction ? 'pointer' : ''
    },
    icon: {
      transition: theme.transitionTimingFunction,
      transform: hovered && !hasAction ? 'scale(1.5)' : 'scale(1)',
      marginTop: theme.spacing.sm,
      marginBottom: theme.spacing.sm
    },
    iconTest: {
      display: 'flex',
      alignItems: 'center',
      color: theme.colors[color][theme.fn.primaryShade()]
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
  const { hovered, ref } = useHover()
  const { classes } = useStyles({ color, hovered, width, height, hasAction: !!action })

  return (
    <Box ref={ref} className={classes.wrapper} onClick={action}>
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
          <Box className={classes.icon}>
            <span className={classes.iconTest}>{icon}</span>
          </Box>
        )}
        {iconLeft && text ? (
          <Group position="center">
            <span className={classes.iconTest}>{iconLeft}</span>
            <Text size="lg" align="start" maw={rem(160)}>
              {text}
            </Text>
          </Group>
        ) : (
          <Group position="apart">
            <Text size="xl" inline maw={rem(160)} color="gray.7">
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
