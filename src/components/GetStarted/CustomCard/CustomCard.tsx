import { Box, Group, Text, Flex, rem, Title, createStyles, MantineColor } from '@mantine/core'
import { useHover } from '@mantine/hooks'
import React, { CSSProperties } from 'react'
import { SystemProp } from '@mantine/styles'

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
      padding: theme.spacing.xl,
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
      transform: hovered && !hasAction ? 'scale(1.5)' : 'scale(1)'
    },
    button: {
      padding: '0'
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
  direction,
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
  direction: SystemProp<CSSProperties['flexDirection']>
  action?: () => void
}) => {
  const { hovered, ref } = useHover()
  const { classes } = useStyles({ color, hovered, width, height, hasAction: !!action })

  return (
    <Box ref={ref} className={classes.wrapper} onClick={action}>
      <Flex mih={50} gap="sm" justify="center" align="center" direction={direction} wrap="wrap">
        {title && (
          <Title mt="sm" color="gray.5" order={2}>
            {title}
          </Title>
        )}
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
          <Group position="apart" mb="xs">
            <Text size="lg" maw={rem(160)}>
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
