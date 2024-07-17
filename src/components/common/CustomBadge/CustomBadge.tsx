import {
  Badge,
  BadgeProps,
  Flex,
  MantineColor,
  MantineTheme,
  Text,
  getPrimaryShade,
  lighten
} from '@mantine/core'
import { createStyles } from '@mantine/emotion'
import { useColorScheme } from '@mantine/hooks'
import { ReactNode } from 'react'

const useStyles = createStyles((theme: MantineTheme, { color }: { color: string }) => {
  const colorScheme = useColorScheme()
  const primaryShade = getPrimaryShade(theme, colorScheme)

  return {
    wrapper: {
      background: lighten(theme.colors[color][primaryShade], theme.other.shades.lighten.lightest),
      fontWeight: 'normal',
      textTransform: 'capitalize'
    }
  }
})

type CustomBadgeProps = BadgeProps & {
  color: MantineColor
  text: string
  icon?: ReactNode
}

const CustomBadge = ({ color, text, icon, ...rest }: CustomBadgeProps) => {
  const { classes } = useStyles({ color })
  return (
    <Badge size="lg" variant="outline" color={color} className={classes.wrapper} {...rest}>
      <Flex align="center" wrap="nowrap">
        <Text mr={icon ? 'xs' : undefined}>{text}</Text>
        {icon}
      </Flex>
    </Badge>
  )
}

export default CustomBadge
